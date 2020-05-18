<?php
/**
 * Fathom Analytics plugin for Craft CMS 3.x
 *
 * Statistics and chart widgets for Fathom analytics.
 *
 * @link      https://stenvdb.be
 * @copyright Copyright (c) 2020 Sten Van den Bergh
 */

namespace stenvdb\fathomanalytics\variables;

use stenvdb\fathomanalytics\FathomAnalytics;

use Craft;

/**
 * Fathom Analytics Variable
 *
 * Craft allows plugins to provide their own template variables, accessible from
 * the {{ craft }} global variable (e.g. {{ craft.fathomAnalytics }}).
 *
 * https://craftcms.com/docs/plugins/variables
 *
 * @author    Sten Van den Bergh
 * @package   FathomAnalytics
 * @since     1.0.0
 */
class FathomAnalyticsVariable
{
    // Public Methods
    // =========================================================================

    public function inject()
    {
        return FathomAnalytics::$plugin->tags->inject();
    }
}
