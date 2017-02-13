class Cell {
    constructor(config = '') {
        this.html = config.html;

        if (config.rowSpan > 1) {
            this.rowSpan = config.rowSpan;
        }

        if (config.colSpan > 1) {
            this.colSpan = config.colSpan;
        }

        if (config.isFixed) {
            this.isFixed = !!config.isFixed;
        }

        if (typeof config === 'string' || typeof config === 'number') {
            this.html = config;
        }

        if (typeof this.html !== 'string') {
            this.html = this.html.toString();
        }
    }
}
let __dataCount, __ruleCount;
if (typeof __ruleCount === 'undefined') {
    __ruleCount = 0;
    __dataCount = 0;
}
export function cell (configList = [], fixedConfigs) {
    let lastRuleType = null;
    let bodyRuleEmpty = false;
    let headRuleEmpty = false;
    const list = [];
    list._id = 'cellList';
    list.rowCount = 0;
    list.colCount = 0;

    if (typeof configList === 'function') {
        configList = configList();

        if (!Array.isArray(configList)) {
            throw new Error('configList返回值必须是Array的实例');
        }
    }
    if (configList.length === 0) {
        bodyRuleEmpty = true;
    }

    if (fixedConfigs) {
        if (typeof fixedConfigs === 'function') {
            fixedConfigs = fixedConfigs();

            if (!Array.isArray(fixedConfigs)) {
                throw new Error('fixedConfigs返回值必须是Array的实例');
            }
        }

        fixedConfigs.forEach((item, index) => {
            if (typeof item === 'function') {
                fixedConfigs[index] = item();
            }

            fixedConfigs[index].isFixed = true;
        });
        if (fixedConfigs.length === 0) {
            headRuleEmpty = true;
        }
        [].unshift.apply(configList, fixedConfigs);
    } else {
        headRuleEmpty = true
    }
    if (headRuleEmpty) {
        __ruleCount++;
    }
    configList.forEach(config => {
        let cell;
        if (typeof config === 'function') {
            cell = new Cell(config());
        } else {
            cell = new Cell(config);
        }
        if (cell.isFixed !== lastRuleType) {
            __ruleCount++;
            lastRuleType = cell.isFixed;
        }
        if (__DEV__) {
            cell.uniqId = `${__ruleCount}-${__dataCount}`;
        } else {
            
        }
        __dataCount++;

        list.rowCount += cell.rowSpan || 1;
        list.colCount += cell.colSpan || 1;
        list.push(cell);
    });
    if (bodyRuleEmpty) {
        __ruleCount++;
    }

    return list;
}
export function resetCellCount () {
    __dataCount = 0;
    __ruleCount = 0;
}
