<?php
/**
 * Fathom Analytics plugin for Craft CMS 3.x
 *
 * Statistics and chart widgets for Fathom analytics.
 *
 * @link      https://stenvdb.be
 * @copyright Copyright (c) 2020 Sten Van den Bergh
 */

namespace stenvdb\fathomanalytics\assetbundles\fathomanalytics;

use Craft;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

/**
 * FathomAnalyticsAsset AssetBundle
 *
 * AssetBundle represents a collection of asset files, such as CSS, JS, images.
 *
 * Each asset bundle has a unique name that globally identifies it among all asset bundles used in an application.
 * The name is the [fully qualified class name](http://php.net/manual/en/language.namespaces.rules.php)
 * of the class representing it.
 *
 * An asset bundle can depend on other asset bundles. When registering an asset bundle
 * with a view, all its dependent asset bundles will be automatically registered.
 *
 * http://www.yiiframework.com/doc-2.0/guide-structure-assets.html
 *
 * @author    Sten Van den Bergh
 * @package   FathomAnalytics
 * @since     1.0.0
 */
class FathomAnalyticsAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init()
    {
        // define the path that your publishable resources live
        $this->sourcePath = "@stenvdb/fathomanalytics/assetbundles/fathomanalytics/dist";

        // define the dependencies
        $this->depends = [
            CpAsset::class,
        ];

        // define the relative path to CSS/JS files that should be registered with the page
        // when this asset bundle is registered
        $this->js = [
            'js/fathomanalytics.min.js',
        ];

        $this->css = [
            'css/fathomanalytics.min.css',
        ];

        parent::init();
    }
}
