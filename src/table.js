const SPAN_PLACEHOLDER = '__SPAN_PLACEHOLDER__';

class Table {
    constructor(cellLists) {
        this.rows = cellLists;
        this.rowCount = cellLists.length;
        this.colCount = Math.max.apply(null, cellLists.map(cellList => cellList.colCount));
        cellLists.forEach((cellList, index) => {
            for (let i = cellList.length - 1; i > -1; i--) {
                if (cellList[i] === SPAN_PLACEHOLDER) {
                    cellList.splice(i, 1);
                }
            }
        });
        for (let i = cellLists.length - 1; i > -1; i--) {
            if (cellLists[i].length === 0) {
                cellLists.splice(i, 1);
            }
        }
    }
    static validateParam(cellLists) {
        if (Array.isArray(cellLists) && cellLists.every(item => item._id === 'cellList')) {
            return true;
        } else {
            throw new Error('表格的行或列必须是cellList数组');
        }
    }
    static adjustSpan(cellLists) {
        cellLists.forEach((cellList, index) => {
            for (let i = cellList.length - 1; i > -1; i--) {
                if (cellList[i] && cellList[i].rowSpan > 1) {
                    let spanSize = cellList[i].rowSpan;
                    let spanPlaceHolder = new Array(spanSize)
                        .join(SPAN_PLACEHOLDER + '|')
                        .split('|')
                        .splice(0, spanSize - 1);

                    if (cellList[i + 1] !== undefined) {
                        [].splice.apply(cellList, [i + 1, 0].concat(spanPlaceHolder));
                    }
                }
            }
        });
        for (let i = 0, len = cellLists.length; i < len; i++) {
            let cellList = cellLists[i];
            for (let insertPosition = 0; insertPosition < cellList.length; insertPosition++) {
                let cell = cellList[insertPosition];
                if (cell && cell.colSpan > 1) {
                    let colSpanSize = cell.colSpan;
                    let rowSpanSize = cell.rowSpan || 1;
                    let placeHolders = (new Array(rowSpanSize)).fill(SPAN_PLACEHOLDER);

                    while (colSpanSize > 1) {
                        let rightCellList = cellLists[i + colSpanSize - 1];
                        if (rightCellList) {
                            [].splice.apply(rightCellList, [insertPosition, 0].concat(placeHolders));
                        }
                        colSpanSize--;
                    }
                }
            }
        }
        return cellLists;
    }
    static exchangeRowAndCol(cellLists) {
        const newCellList = [];
        const newRowCount = Math.max.apply(null, cellLists.map(cellList => cellList.rowCount));

        for (let i = 0; i < newRowCount; i++) {
            newCellList[i] = [];
            newCellList[i].colCount = 0;
            newCellList[i]._id = 'cellList';

            cellLists.forEach(cellList => {
                newCellList[i].push(cellList[i] || SPAN_PLACEHOLDER);
                newCellList[i].colCount++;
            });
        }

        return newCellList;
    }
}
export function table(cellLists, isByRows) {
    if (Table.validateParam(cellLists)) {
        cellLists = !!isByRows ? Table.adjustSpan(cellLists) : Table.exchangeRowAndCol(Table.adjustSpan(cellLists));
        return new Table(cellLists);
    }
}

