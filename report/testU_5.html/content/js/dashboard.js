/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.31914893617021, "KoPercent": 4.680851063829787};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.74375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://iotait.tech/-29"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-28"], "isController": false}, {"data": [0.9, 500, 1500, "https://iotait.tech/-27"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-26"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-25"], "isController": false}, {"data": [0.9, 500, 1500, "https://iotait.tech/-24"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-9"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-23"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/57af3046278b424f.css"], "isController": false}, {"data": [0.7, 500, 1500, "https://iotait.tech/-22"], "isController": false}, {"data": [0.7, 500, 1500, "https://iotait.tech/-21"], "isController": false}, {"data": [0.1, 500, 1500, "https://iotait.tech/-6"], "isController": false}, {"data": [0.9, 500, 1500, "https://iotait.tech/-20"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/e8dac28151c0ddbb.css"], "isController": false}, {"data": [0.5, 500, 1500, "https://iotait.tech/-5"], "isController": false}, {"data": [0.2, 500, 1500, "https://iotait.tech/-8"], "isController": false}, {"data": [0.2, 500, 1500, "https://iotait.tech/-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/9adbdbe4f65db4c9.css"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/b61ac2a384eb4aa7.css"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/4060819d1cd0c31d.css"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/45f254b11aa40c47.css"], "isController": false}, {"data": [0.9, 500, 1500, "https://iotait.tech/_next/static/css/d8277bf77f0b575e.css"], "isController": false}, {"data": [0.9, 500, 1500, "https://iotait.tech/-19"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-18"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-17"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-16"], "isController": false}, {"data": [0.9, 500, 1500, "https://iotait.tech/-15"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-14"], "isController": false}, {"data": [0.7, 500, 1500, "https://iotait.tech/-13"], "isController": false}, {"data": [0.7, 500, 1500, "https://iotait.tech/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/1f0f629f162b170f.css"], "isController": false}, {"data": [0.2, 500, 1500, "https://iotait.tech/-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://iotait.tech/-10"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-32"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-31"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-30"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/ef46db3751d8e999.css"], "isController": false}, {"data": [0.3, 500, 1500, "https://iotait.tech/-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://iotait.tech/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/3ab3f7cb1da3328d.css"], "isController": false}, {"data": [0.3, 500, 1500, "https://iotait.tech/-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://iotait.tech/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://iotait.tech/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/c41db919a492bc23.css"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/69383284b1527f6a.css"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/b4faa1f47b5c481e.css"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 235, 11, 4.680851063829787, 622.4638297872345, 0, 5708, 274.0, 1354.8000000000002, 1675.7999999999997, 5482.239999999996, 14.107335814623605, 545.0319126883479, 11.079921715542081], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://iotait.tech/-29", 5, 0, 0.0, 27.799999999999997, 12, 70, 18.0, 70.0, 70.0, 70.0, 0.6602403274792025, 3.5784509936616926, 0.3533317377525419], "isController": false}, {"data": ["https://iotait.tech/-28", 5, 0, 0.0, 47.8, 23, 67, 53.0, 67.0, 67.0, 67.0, 0.6556517178075006, 0.8152107100708104, 0.35087611460792023], "isController": false}, {"data": ["https://iotait.tech/-27", 5, 0, 0.0, 396.6, 267, 798, 275.0, 798.0, 798.0, 798.0, 0.643915003219575, 1.5267828396651644, 0.32698808757244047], "isController": false}, {"data": ["https://iotait.tech/-26", 5, 0, 0.0, 272.4, 259, 287, 272.0, 287.0, 287.0, 287.0, 0.6442468754026544, 1.8339644939440793, 0.32401087971910836], "isController": false}, {"data": ["https://iotait.tech/-25", 5, 0, 0.0, 280.6, 259, 340, 268.0, 340.0, 340.0, 340.0, 0.6441638752898738, 1.538696131795929, 0.3258563353517135], "isController": false}, {"data": ["https://iotait.tech/-24", 5, 0, 0.0, 439.8, 267, 1109, 268.0, 1109.0, 1109.0, 1109.0, 0.5803830528148578, 1.3188978163087637, 0.2918918673824724], "isController": false}, {"data": ["https://iotait.tech/-9", 5, 0, 0.0, 477.0, 274, 783, 279.0, 783.0, 783.0, 783.0, 0.6410256410256411, 5.121319110576923, 0.335536858974359], "isController": false}, {"data": ["https://iotait.tech/-23", 5, 0, 0.0, 618.8, 261, 1106, 385.0, 1106.0, 1106.0, 1106.0, 0.5741187277528993, 2.2168607905614883, 0.2864987010563785], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/57af3046278b424f.css", 5, 0, 0.0, 265.2, 260, 270, 265.0, 270.0, 270.0, 270.0, 0.6493506493506493, 2.7134486607142856, 0.2333603896103896], "isController": false}, {"data": ["https://iotait.tech/-22", 5, 1, 20.0, 428.0, 160, 1062, 274.0, 1062.0, 1062.0, 1062.0, 0.6485925541574783, 3.1537812945907384, 0.2574101699312492], "isController": false}, {"data": ["https://iotait.tech/-21", 5, 1, 20.0, 426.4, 175, 1095, 273.0, 1095.0, 1095.0, 1095.0, 0.643915003219575, 1.6937982936252416, 0.2570629426915647], "isController": false}, {"data": ["https://iotait.tech/-6", 5, 0, 0.0, 1616.2, 810, 1906, 1897.0, 1906.0, 1906.0, 1906.0, 0.5612302166348636, 71.8856984510046, 0.2970573998204063], "isController": false}, {"data": ["https://iotait.tech/-20", 5, 0, 0.0, 432.8, 264, 1085, 271.0, 1085.0, 1085.0, 1085.0, 0.6380806533945891, 0.873622144589076, 0.3140553215926493], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/e8dac28151c0ddbb.css", 5, 0, 0.0, 270.4, 262, 289, 267.0, 289.0, 289.0, 289.0, 0.647920176234288, 1.040215595438642, 0.23284631333419722], "isController": false}, {"data": ["https://iotait.tech/-5", 5, 0, 0.0, 990.8, 774, 1148, 1096.0, 1148.0, 1148.0, 1148.0, 0.6128201985537444, 3.1927692961760017, 0.3231669015810761], "isController": false}, {"data": ["https://iotait.tech/-8", 5, 1, 20.0, 1202.4, 560, 1600, 1490.0, 1600.0, 1600.0, 1600.0, 0.5614823133071308, 61.056924656092086, 0.2381913250982594], "isController": false}, {"data": ["https://iotait.tech/-7", 5, 1, 20.0, 1268.4, 558, 1691, 1336.0, 1691.0, 1691.0, 1691.0, 0.5589714924538849, 43.08589383035215, 0.23450600894354387], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/9adbdbe4f65db4c9.css", 5, 0, 0.0, 264.4, 259, 271, 262.0, 271.0, 271.0, 271.0, 0.6458279514337381, 1.989831237083441, 0.2320944200464996], "isController": false}, {"data": ["Test", 5, 2, 40.0, 8601.0, 7632, 9345, 8702.0, 9345.0, 9345.0, 9345.0, 0.29934742261869124, 279.67369026148, 6.237008789588697], "isController": true}, {"data": ["https://iotait.tech/_next/static/css/b61ac2a384eb4aa7.css", 5, 0, 0.0, 267.2, 258, 288, 262.0, 288.0, 288.0, 288.0, 0.6453278265358802, 0.1896910896360351, 0.28674234479865773], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/4060819d1cd0c31d.css", 5, 0, 0.0, 265.2, 259, 277, 263.0, 277.0, 277.0, 277.0, 0.6454944487477408, 0.9720238671572424, 0.23197456751871934], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/45f254b11aa40c47.css", 5, 0, 0.0, 265.8, 261, 275, 264.0, 275.0, 275.0, 275.0, 0.6443298969072165, 4.217088836984536, 0.23155605670103094], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/d8277bf77f0b575e.css", 5, 0, 0.0, 321.0, 264, 528, 270.0, 528.0, 528.0, 528.0, 0.647332988089073, 11.514182661185913, 0.2326352925945106], "isController": false}, {"data": ["https://iotait.tech/-19", 5, 0, 0.0, 448.2, 259, 1084, 269.0, 1084.0, 1084.0, 1084.0, 0.6317119393556537, 0.545345072646873, 0.31153762634238785], "isController": false}, {"data": ["https://iotait.tech/-18", 5, 1, 20.0, 266.8, 124, 415, 269.0, 415.0, 415.0, 415.0, 0.6231306081754736, 1.6736898678963112, 0.2438972146061815], "isController": false}, {"data": ["https://iotait.tech/", 5, 2, 40.0, 5087.2, 4239, 5708, 5280.0, 5708.0, 5708.0, 5708.0, 0.3781290176208122, 333.3397831902745, 6.07975331808213], "isController": false}, {"data": ["https://iotait.tech/-17", 5, 1, 20.0, 256.6, 152, 326, 270.0, 326.0, 326.0, 326.0, 0.6349206349206349, 0.6651785714285714, 0.2728174603174603], "isController": false}, {"data": ["https://iotait.tech/-16", 5, 1, 20.0, 253.6, 183, 279, 267.0, 279.0, 279.0, 279.0, 0.6354855109303508, 0.6583232714794103, 0.26958486908998475], "isController": false}, {"data": ["https://iotait.tech/-15", 5, 0, 0.0, 455.8, 259, 1089, 278.0, 1089.0, 1089.0, 1089.0, 0.6323510813203491, 2.358965947894271, 0.3365540423042873], "isController": false}, {"data": ["https://iotait.tech/-14", 5, 1, 20.0, 244.6, 0, 369, 286.0, 369.0, 369.0, 369.0, 0.6414368184733803, 21.887653343489415, 0.27261064785118666], "isController": false}, {"data": ["https://iotait.tech/-13", 5, 0, 0.0, 429.0, 281, 542, 517.0, 542.0, 542.0, 542.0, 0.6415191172696946, 21.846733063895304, 0.3357951629458558], "isController": false}, {"data": ["https://iotait.tech/-12", 5, 0, 0.0, 534.8, 273, 813, 511.0, 813.0, 813.0, 813.0, 0.6005284650492434, 5.090417067018977, 0.31375266484506364], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/1f0f629f162b170f.css", 5, 0, 0.0, 263.8, 258, 272, 262.0, 272.0, 272.0, 272.0, 0.6498570314530804, 0.6796844537951651, 0.23354237067845074], "isController": false}, {"data": ["https://iotait.tech/-11", 5, 1, 20.0, 1222.6, 587, 1814, 1114.0, 1814.0, 1814.0, 1814.0, 0.5597223777006605, 76.8720745760103, 0.2343837456621516], "isController": false}, {"data": ["https://iotait.tech/-10", 5, 0, 0.0, 1076.0, 541, 1350, 1339.0, 1350.0, 1350.0, 1350.0, 0.6050338818973863, 32.21450909063408, 0.3161065691553727], "isController": false}, {"data": ["https://iotait.tech/-32", 5, 0, 0.0, 484.8, 261, 816, 271.0, 816.0, 816.0, 816.0, 0.6406970784213224, 3.216624687660174, 0.31847149698872373], "isController": false}, {"data": ["https://iotait.tech/-31", 5, 0, 0.0, 365.0, 319, 492, 340.0, 492.0, 492.0, 492.0, 0.6346788525006347, 30.884811738385377, 0.33531372969027673], "isController": false}, {"data": ["https://iotait.tech/-30", 5, 0, 0.0, 28.8, 14, 69, 15.0, 69.0, 69.0, 69.0, 0.6606765327695561, 1.6969838051664905, 0.3535651757399577], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/ef46db3751d8e999.css", 5, 0, 0.0, 263.6, 259, 269, 262.0, 269.0, 269.0, 269.0, 0.6501950585175553, 0.23429880526657995, 0.23366384915474642], "isController": false}, {"data": ["https://iotait.tech/-2", 5, 0, 0.0, 1448.6, 1302, 1637, 1343.0, 1637.0, 1637.0, 1637.0, 0.5758378440631119, 37.822536673672694, 0.2980410716342278], "isController": false}, {"data": ["https://iotait.tech/-1", 5, 0, 0.0, 479.4, 260, 805, 274.0, 805.0, 805.0, 805.0, 0.6138735420503376, 0.7775331875383671, 0.2997429404542664], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/3ab3f7cb1da3328d.css", 5, 0, 0.0, 266.2, 261, 271, 267.0, 271.0, 271.0, 271.0, 0.6433350488934637, 1.6686502830674215, 0.23119853319608852], "isController": false}, {"data": ["https://iotait.tech/-4", 5, 0, 0.0, 1299.0, 545, 1672, 1320.0, 1672.0, 1672.0, 1672.0, 0.6341154090044389, 56.862936945149016, 0.33563530437539635], "isController": false}, {"data": ["https://iotait.tech/-3", 5, 0, 0.0, 898.4, 781, 1071, 799.0, 1071.0, 1071.0, 1071.0, 0.6143260842855387, 5.375353237498465, 0.31796174284310114], "isController": false}, {"data": ["https://iotait.tech/-0", 5, 0, 0.0, 1537.0, 1307, 2109, 1362.0, 2109.0, 2109.0, 2109.0, 0.5261496369567505, 14.180863115595075, 0.2533122763864043], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/c41db919a492bc23.css", 5, 0, 0.0, 262.8, 258, 270, 261.0, 270.0, 270.0, 270.0, 0.6443298969072165, 0.5788901417525774, 0.23155605670103094], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/69383284b1527f6a.css", 5, 0, 0.0, 268.2, 261, 274, 270.0, 274.0, 274.0, 274.0, 0.6462453147214682, 3.303802951725475, 0.23224440997802764], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/b4faa1f47b5c481e.css", 5, 0, 0.0, 270.0, 263, 278, 269.0, 278.0, 278.0, 278.0, 0.6475006475006475, 4.998527947746697, 0.2326955451955452], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, 9.090909090909092, 0.425531914893617], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 8, 72.72727272727273, 3.404255319148936], "isController": false}, {"data": ["Assertion failed", 2, 18.181818181818183, 0.851063829787234], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 235, 11, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 8, "Assertion failed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://iotait.tech/-22", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://iotait.tech/-21", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://iotait.tech/-8", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://iotait.tech/-7", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://iotait.tech/-18", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://iotait.tech/", 5, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://iotait.tech/-17", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://iotait.tech/-16", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://iotait.tech/-14", 5, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://iotait.tech/-11", 5, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
