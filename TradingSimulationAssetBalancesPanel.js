﻿
function newTradingEnginesPlottersTradingSimulationTradingSimulationTradingSimulationAssetBalancesPanel() {

    let thisObject = {
        fitFunction: undefined,
        onRecordChange: onRecordChange,
        container: undefined,
        session: undefined,
        isVisible: true,
        draw: draw,
        getContainer: getContainer,
        initialize: initialize,
        finalize: finalize
    };

    let container = newContainer();
    container.initialize();
    thisObject.container = container;

    container.frame.containerName = "Simulation Asset Balances Panel";

    let record;
    let lastRecord;
    let upDownButton

    const HEIGHT_FACTOR = 1.25

    return thisObject;

    function initialize() {

        thisObject.container.frame.width = UI_PANEL.WIDTH.NORMAL * 1;
        thisObject.container.frame.height = UI_PANEL.HEIGHT.NORMAL * HEIGHT_FACTOR;

        thisObject.container.frame.position.x = canvas.chartingSpace.viewport.visibleArea.topRight.x - thisObject.container.frame.width * 1;
        thisObject.container.frame.position.y = canvas.chartingSpace.viewport.visibleArea.topRight.y;

        upDownButton = newUpDownButton()
        upDownButton.parentContainer = thisObject.container
        upDownButton.container.frame.parentFrame = thisObject.container.frame
        upDownButton.fitFunction = thisObject.fitFunction
        upDownButton.initialize()

        thisObject.assetBalances = newAssetalances()
        thisObject.assetBalances.container.connectToParent(thisObject.container, true, true)
        thisObject.assetBalances.initialize()

    }

    function finalize() {
        thisObject.session = undefined

        thisObject.container.finalize()
        thisObject.container = undefined
        thisObject.fitFunction = undefined
        thisObject.onRecordChange = undefined
        thisObject.isVisible = undefined

        record = undefined
        lastRecord = undefined
        upDownButton = undefined

        thisObject.assetBalances.finalize()
        thisObject.assetBalances = undefined
    }

    function getContainer(point) {
        if (thisObject.isVisible !== true) { return }
        let container;

        container = upDownButton.getContainer(point)
        if (container !== undefined) { return container }

        if (thisObject.container.frame.isThisPointHere(point, true) === true) {

            let checkPoint = {
                x: point.x,
                y: point.y
            }

            checkPoint = thisObject.fitFunction(checkPoint)

            if (point.x === checkPoint.x && point.y === checkPoint.y) {
                return thisObject.container;
            }
        }
    }


    function onRecordChange(records) {

        record = records.record;
        lastRecord = records.lastRecord

    }


    function draw() {
        if (thisObject.isVisible !== true) { return }
        thisObject.container.frame.draw(false, false, true, thisObject.fitFunction);

        plotCurrentRecordInfo();

        upDownButton.draw()

        /* Define panel name */
        if (thisObject.session !== undefined) {
            const MAX_LABEL_LENGTH = 25
            if (thisObject.session.name.length > MAX_LABEL_LENGTH) {
                container.frame.containerName = thisObject.session.name.substring(0, MAX_LABEL_LENGTH) + '...'
            } else {
                container.frame.containerName = thisObject.session.name
            }
        }
    }


    function plotCurrentRecordInfo() {

        if (record === undefined) { return; }

        const frameBodyHeight = thisObject.container.frame.getBodyHeight();
        const frameTitleHeight = thisObject.container.frame.height - frameBodyHeight;

        const X_AXIS = thisObject.container.frame.width / 2;
        const Y_AXIS = frameTitleHeight + frameBodyHeight / 2;

        /* put the labels with the records values */

        let y = 0;
        let increment = 0.024 / HEIGHT_FACTOR * 2.5;

        y = y + increment;
        y = y + increment;
        printLabel('Asset Balances', X_AXIS, frameTitleHeight + frameBodyHeight * y, '1.00', 14, undefined, true, thisObject.container, thisObject.fitFunction);

        /* Parameters */
        let params
        let paramsArray = []
        let positionTaken = false

        if (record.positionSize > 0) {
            positionTaken = true
        }

        let testPoint = {
            x: 0,
            y: thisObject.container.frame.height
        }

        testPoint = thisObject.container.frame.frameThisPoint(testPoint)
        let fitPoint = thisObject.fitFunction(testPoint)
        if (fitPoint.y !== testPoint.y) {
            return
        }

        if (record.baseAsset === record.marketBaseAsset) {
            params = {}
            params.VALUE = record.variable_current_balance_baseAsset;
            params.INIT_VALUE = record.initialBalanceA
            params.MIN_VALUE = record.minimunBalanceA
            params.MAX_VALUE = record.maximunBalanceA
            params.ASSET_LABEL = 'Base'
            params.ASSET_NAME = record.baseAsset
            params.LEFT_OFFSET = X_AXIS
            params.POSITION_TAKEN = positionTaken
            params.BASE_ASSET = record.baseAsset
            params.DECIMALS = 4

            paramsArray.push(params)

            params = {}
            params.VALUE = record.variable_current_balance_quotedAsset;
            params.MIN_VALUE = record.minimunBalanceB
            params.INIT_VALUE = record.initialBalanceB
            params.MAX_VALUE = record.maximunBalanceB
            params.ASSET_LABEL = 'Quoted'
            params.ASSET_NAME = record.quotedAsset
            params.LEFT_OFFSET = X_AXIS
            params.POSITION_TAKEN = positionTaken
            params.BASE_ASSET = record.baseAsset
            params.DECIMALS = 2

            paramsArray.push(params)
        } else {
            params = {}
            params.VALUE = record.variable_current_balance_quotedAsset;
            params.INIT_VALUE = record.initialBalanceB
            params.MIN_VALUE = record.minimunBalanceB
            params.MAX_VALUE = record.maximunBalanceB
            params.ASSET_LABEL = 'Base'
            params.ASSET_NAME = record.baseAsset
            params.LEFT_OFFSET = X_AXIS
            params.POSITION_TAKEN = positionTaken
            params.BASE_ASSET = record.baseAsset
            params.DECIMALS = 4

            paramsArray.push(params)

            params = {}
            params.VALUE = record.variable_current_balance_baseAsset;
            params.MIN_VALUE = record.minimunBalanceA
            params.INIT_VALUE = record.initialBalanceA
            params.MAX_VALUE = record.maximunBalanceA
            params.ASSET_LABEL = 'Quoted'
            params.ASSET_NAME = record.quotedAsset
            params.LEFT_OFFSET = X_AXIS
            params.POSITION_TAKEN = positionTaken
            params.BASE_ASSET = record.baseAsset
            params.DECIMALS = 2

            paramsArray.push(params)
        }


        thisObject.assetBalances.setParamsArray(paramsArray)
        thisObject.assetBalances.draw()
    }
}
