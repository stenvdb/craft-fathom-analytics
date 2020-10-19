<?php
/**
 * Fathom Analytics plugin for Craft CMS 3.x
 *
 * Statistics and chart widgets for Fathom analytics.
 *
 * @link      https://stenvdb.be
 * @copyright Copyright (c) 2020 Sten Van den Bergh
 */

namespace stenvdb\fathomanalytics\models;

use craft\behaviors\EnvAttributeParserBehavior;
use craft\helpers\ConfigHelper;
use stenvdb\fathomanalytics\FathomAnalytics;

use Craft;
use craft\base\Model;

/**
 * FathomAnalytics Settings Model
 *
 * This is a model used to define the plugin's settings.
 *
 * Models are containers for data. Just about every time information is passed
 * between services, controllers, and templates in Craft, it’s passed via a model.
 *
 * https://craftcms.com/docs/plugins/models
 *
 * @author    Sten Van den Bergh
 * @package   FathomAnalytics
 * @since     1.0.0
 */
class Settings extends Model
{
    // Public Properties
    // =========================================================================

    /**
     * Some field model attribute
     *
     * @var string
     */
    public $baseUri;

    public $username;

    public $password;

    public $trackingId;

    public $injectTracking = false;

    public $trackingCode = "(function(f, a, t, h, o, m){
    a[h]=a[h]||function(){
      (a[h].q=a[h].q||[]).push(arguments)
    };
    o=f.createElement(\'script\'),
      m=f.getElementsByTagName(\'script\')[0];
    o.async=1; o.src=t; o.id=\'fathom-script\';
    m.parentNode.insertBefore(o,m)
  })(document, window, \'//{{ baseUri }}/tracker.js\', \'fathom\');
  fathom(\'set\', \'siteId\', \'{{ trackingId }}\');
  fathom(\'trackPageview\');";

    // Public Methods
    // =========================================================================

    public function getBaseUri($siteHandle = null): string
    {
        // Cleanup the uri so we get a clean domain name
        $baseUri = rtrim(preg_replace('#^https?://#', '', Craft::parseEnv(ConfigHelper::localizedValue($this->baseUri, $siteHandle))), '/');
        return $baseUri;
    }

    public function getUsername($siteHandle = null): string
    {
        return Craft::parseEnv(ConfigHelper::localizedValue($this->username, $siteHandle));
    }

    public function getPassword($siteHandle = null): string
    {
        return Craft::parseEnv(ConfigHelper::localizedValue($this->password, $siteHandle));
    }

    public function getTrackingId($siteHandle = null): string
    {
        return Craft::parseEnv(ConfigHelper::localizedValue($this->trackingId, $siteHandle));
    }

    public function behaviors()
    {
        return [
            'parser' => [
                'class' => EnvAttributeParserBehavior::class,
                'attributes' => ['baseUri', 'username'],
            ],
        ];
    }

    public function rules()
    {
        return [
            ['username', 'email'],
            ['baseUri', 'url']
        ];
    }
}
