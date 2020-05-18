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

use craft\web\View;
use stenvdb\fathomanalytics\FathomAnalytics;

use Craft;
use craft\base\Component;

/**
 * Tags Service
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
class Tags extends Component
{
    // Public Methods
    // =========================================================================

    public function inject()
    {
        $settings = FathomAnalytics::$plugin->getSettings();
        $trackingCode = $settings->trackingCode;
        $data = [
            'baseUri' => $settings->getBaseUri(),
            'trackingId' => $settings->getTrackingId()
        ];

        $js = Craft::$app->getView()->renderString($trackingCode, $data);

        $js = stripslashes(trim($js));

        Craft::$app->getView()->registerJs($js, View::POS_HEAD);
    }
}
