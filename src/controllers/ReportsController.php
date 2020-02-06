<?php
/**
 * Fathom Analytics plugin for Craft CMS 3.x
 *
 * Statistics and chart widgets for Fathom analytics.
 *
 * @link      https://stenvdb.be
 * @copyright Copyright (c) 2020 Sten Van den Bergh
 */

namespace stenvdb\fathomanalytics\controllers;

use stenvdb\fathomanalytics\FathomAnalytics;

use Craft;
use craft\web\Controller;

/**
 * Reports Controller
 *
 * Generally speaking, controllers are the middlemen between the front end of
 * the CP/website and your plugin’s services. They contain action methods which
 * handle individual tasks.
 *
 * A common pattern used throughout Craft involves a controller action gathering
 * post data, saving it on a model, passing the model off to a service, and then
 * responding to the request appropriately depending on the service method’s response.
 *
 * Action methods begin with the prefix “action”, followed by a description of what
 * the method does (for example, actionSaveIngredient()).
 *
 * https://craftcms.com/docs/plugins/controllers
 *
 * @author    <%- pluginAuthorName %>
 * @package   <%= pluginHandle %>
 * @since     <%= pluginVersion %>
 */

class ReportsController extends Controller
{

    // Protected Properties
    // =========================================================================

    protected $allowAnonymous = [];

    // Public Methods
    // =========================================================================

    public function actionRealtimeWidget()
    {
        $this->requireCpRequest();

        $jsonData = FathomAnalytics::$plugin->reports->getRealtimeVisitors();

        return $jsonData;
    }

    public function actionReportWidget()
    {
        $this->requireCpRequest();

        $before = Craft::$app->getRequest()->getParam('before');
        $after = Craft::$app->getRequest()->getParam('after');

        $jsonData = FathomAnalytics::$plugin->reports->getReport($before, $after);

        return $jsonData;
    }

    public function actionSiteStats()
    {
        $this->requireCpRequest();

        $before = Craft::$app->getRequest()->getParam('before');
        $after = Craft::$app->getRequest()->getParam('after');

        $jsonData = FathomAnalytics::$plugin->reports->getSiteStats($before, $after);

        return $jsonData;
    }

    public function actionTopPagesWidget()
    {
        $this->requireCpRequest();

        $before = Craft::$app->getRequest()->getParam('before');
        $after = Craft::$app->getRequest()->getParam('after');

        $jsonData = FathomAnalytics::$plugin->reports->getTopPages($before, $after);

        return $jsonData;
    }
}
