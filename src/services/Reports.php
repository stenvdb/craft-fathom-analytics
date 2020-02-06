<?php
/**
 * Fathom Analytics plugin for Craft CMS 3.x
 *
 * Statistics and chart widgets for Fathom analytics.
 *
 * @link      https://stenvdb.be
 * @copyright Copyright (c) 2020 Sten Van den Bergh
 */

namespace stenvdb\fathomanalytics\services;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\Exception\ServerException;
use stenvdb\fathomanalytics\FathomAnalytics;

use Craft;
use craft\base\Component;

/**
 * Reports Service
 *
 * All of your plugin’s business logic should go in services, including saving data,
 * retrieving data, etc. They provide APIs that your controllers, template variables,
 * and other plugins can interact with.
 *
 * https://craftcms.com/docs/plugins/services
 *
 * @author    Sten Van den Bergh
 * @package   FathomAnalytics
 * @since     1.0.0
 */
class Reports extends Component
{
    // Public Methods
    // =========================================================================

    public function getRealtimeVisitors()
    {
        $response = $this->hitFathom('stats/site/realtime', null, null);

        return $this->parseResponse($response);
    }

    public function getReport($before, $after)
    {
        $response = $this->hitFathom('stats/site', $before, $after);

        return $this->parseResponse($response);
    }

    public function getSiteStats($before, $after) {
        $response = $this->hitFathom('stats/site/agg', $before, $after);

        return $this->parseResponse($response);
    }

    public function getTopPages($before, $after)
    {
        $response = $this->hitFathom('stats/pages/agg', $before, $after);

        return $this->parseResponse($response);
    }

    // Private Methods
    // =========================================================================

    private function authenticate()
    {
        $client = new Client([
            'base_uri' => FathomAnalytics::$plugin->getSettings()->getBaseUri()
        ]);

        $jar = new CookieJar;
        $response = $client->post('api/session', [
            'json' => [
                'email' => FathomAnalytics::$plugin->getSettings()->getUsername(),
                'password' => FathomAnalytics::$plugin->getSettings()->getPassword(),
            ],
            'cookies' => $jar,
            'headers' => [
                'Content-Type' => 'application/json; charset=utf-8'
            ]
        ]);

        if (!$response->getStatusCode() === 200)
        {
            return;
        }

        // Save our auth cookie for reuse
        Craft::$app->getSession()->set('fa-auth', $jar->getCookieByName('auth')->getValue());
    }

    private function getCookieJar()
    {
        if (is_null(Craft::$app->getSession()->get('fa-auth'))) {
            $this->authenticate();
        }

        $jar = CookieJar::fromArray([
            'auth' => Craft::$app->getSession()->get('fa-auth')
        ], parse_url(FathomAnalytics::$plugin->getSettings()->getBaseUri())['host']);

        return $jar;
    }

    private function hitFathom($endpoint, $before, $after)
    {
        $jar = $this->getCookieJar();

        $baseUri = FathomAnalytics::$plugin->getSettings()->getBaseUri();

        if (substr($baseUri, -1) !== '/')
        {
            $baseUri .= '/';
        }

        $siteId = $this->getSiteId(FathomAnalytics::$plugin->getSettings()->getTrackingId());

        $baseUri .= 'api/sites/'.$siteId.'/';

        $client = new Client([
            'base_uri' => $baseUri
        ]);

        $query = [];

        if (isset($before) && isset($after))
        {
            $query['before'] = $before;
            $query['after'] = $after;
        }

        return $client->get($endpoint, [
            'cookies' => $jar,
            'query' => $query
        ]);
    }

    private function getSiteId($trackingId)
    {
        $jar = $this->getCookieJar();

        $baseUri = FathomAnalytics::$plugin->getSettings()->getBaseUri();

        $endpoint = $baseUri . 'api/sites';

        $client = new Client([
            'base_uri' => $baseUri
        ]);

        $response = $client->get($endpoint, [
            'cookies' => $jar
        ]);

        if (!$response->getStatusCode() === 200)
        {
            return;
        }

        $data = json_decode($response->getBody()->getContents());

        $siteId = null;
        foreach($data->Data as $site) {
            if (FathomAnalytics::$plugin->getSettings()->getTrackingId() == $site->trackingId) {
                $siteId = $site->id;
                break;
            }
        }

        return $siteId;
    }

    private function parseResponse($response)
    {
        if (!$response->getStatusCode() === 200)
        {
            return;
        }

        $jsonData = $response->getBody()->getContents();

        return $jsonData;
    }
}
