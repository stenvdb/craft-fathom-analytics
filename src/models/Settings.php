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

    // Public Methods
    // =========================================================================

    public function getBaseUri(): string
    {
        return Craft::parseEnv($this->baseUri);
    }

    public function getUsername(): string
    {
        return Craft::parseEnv($this->username);
    }

    public function getPassword(): string
    {
        return Craft::parseEnv($this->password);
    }

    public function getTrackingId(): string
    {
        return Craft::parseEnv($this->trackingId);
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
