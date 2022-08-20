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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6640625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://iotait.tech/-29"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-28"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-27"], "isController": false}, {"data": [0.75, 500, 1500, "https://iotait.tech/-26"], "isController": false}, {"data": [0.875, 500, 1500, "https://iotait.tech/-25"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-24"], "isController": false}, {"data": [0.75, 500, 1500, "https://iotait.tech/-9"], "isController": false}, {"data": [0.875, 500, 1500, "https://iotait.tech/-23"], "isController": false}, {"data": [0.875, 500, 1500, "https://iotait.tech/_next/static/css/57af3046278b424f.css"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-22"], "isController": false}, {"data": [0.875, 500, 1500, "https://iotait.tech/-21"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-20"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/e8dac28151c0ddbb.css"], "isController": false}, {"data": [0.625, 500, 1500, "https://iotait.tech/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/9adbdbe4f65db4c9.css"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/b61ac2a384eb4aa7.css"], "isController": false}, {"data": [0.875, 500, 1500, "https://iotait.tech/_next/static/css/4060819d1cd0c31d.css"], "isController": false}, {"data": [0.5, 500, 1500, "https://iotait.tech/_next/static/css/45f254b11aa40c47.css"], "isController": false}, {"data": [0.5, 500, 1500, "https://iotait.tech/_next/static/css/d8277bf77f0b575e.css"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-18"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-17"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-16"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-15"], "isController": false}, {"data": [0.25, 500, 1500, "https://iotait.tech/-14"], "isController": false}, {"data": [0.375, 500, 1500, "https://iotait.tech/-13"], "isController": false}, {"data": [0.625, 500, 1500, "https://iotait.tech/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/1f0f629f162b170f.css"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/-11"], "isController": false}, {"data": [0.375, 500, 1500, "https://iotait.tech/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-32"], "isController": false}, {"data": [0.875, 500, 1500, "https://iotait.tech/-31"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/-30"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/ef46db3751d8e999.css"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/-2"], "isController": false}, {"data": [0.375, 500, 1500, "https://iotait.tech/-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://iotait.tech/_next/static/css/3ab3f7cb1da3328d.css"], "isController": false}, {"data": [0.0, 500, 1500, "https://iotait.tech/-4"], "isController": false}, {"data": [0.375, 500, 1500, "https://iotait.tech/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://iotait.tech/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://iotait.tech/_next/static/css/c41db919a492bc23.css"], "isController": false}, {"data": [0.75, 500, 1500, "https://iotait.tech/_next/static/css/69383284b1527f6a.css"], "isController": false}, {"data": [0.5, 500, 1500, "https://iotait.tech/_next/static/css/b4faa1f47b5c481e.css"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 188, 0, 0.0, 1206.7127659574471, 12, 13152, 275.0, 3469.1999999999994, 5161.249999999993, 12349.219999999987, 8.306088185914994, 351.18178128037465, 6.853109536537952], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://iotait.tech/-29", 4, 0, 0.0, 27.25, 14, 60, 17.5, 60.0, 60.0, 60.0, 0.6088280060882801, 3.300989345509893, 0.3258181126331811], "isController": false}, {"data": ["https://iotait.tech/-28", 4, 0, 0.0, 56.5, 44, 72, 55.0, 72.0, 72.0, 72.0, 0.6026819346090101, 0.7509981919541963, 0.3225290040681031], "isController": false}, {"data": ["https://iotait.tech/-27", 4, 0, 0.0, 262.5, 262, 264, 262.0, 264.0, 264.0, 264.0, 0.595149531319744, 1.4111553340276743, 0.30222437137330754], "isController": false}, {"data": ["https://iotait.tech/-26", 4, 0, 0.0, 713.75, 269, 1287, 649.5, 1287.0, 1287.0, 1287.0, 0.5211047420531526, 1.4834182842626367, 0.2620790450755602], "isController": false}, {"data": ["https://iotait.tech/-25", 4, 0, 0.0, 453.5, 261, 1007, 273.0, 1007.0, 1007.0, 1007.0, 0.5836008170411439, 1.394030857893201, 0.2952199445579224], "isController": false}, {"data": ["https://iotait.tech/-24", 4, 0, 0.0, 263.75, 260, 270, 262.5, 270.0, 270.0, 270.0, 0.5821568912822005, 1.3229287949352349, 0.29278398340852857], "isController": false}, {"data": ["https://iotait.tech/-9", 4, 0, 0.0, 662.75, 268, 1297, 543.0, 1297.0, 1297.0, 1297.0, 0.5808044141135472, 4.640196202991143, 0.3040148105125599], "isController": false}, {"data": ["https://iotait.tech/-23", 4, 0, 0.0, 351.5, 268, 592, 273.0, 592.0, 592.0, 592.0, 0.5571806658308956, 2.151457375679064, 0.2780462111714723], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/57af3046278b424f.css", 4, 0, 0.0, 334.5, 263, 534, 270.5, 534.0, 534.0, 534.0, 0.56657223796034, 2.3675416076487252, 0.20361189801699717], "isController": false}, {"data": ["https://iotait.tech/-22", 4, 0, 0.0, 262.5, 260, 264, 263.0, 264.0, 264.0, 264.0, 0.5729838132072769, 2.99921214725684, 0.2842536885832975], "isController": false}, {"data": ["https://iotait.tech/-21", 4, 0, 0.0, 495.24999999999994, 269, 1159, 276.5, 1159.0, 1159.0, 1159.0, 0.5762028233938347, 1.4084332685105156, 0.28753871362719674], "isController": false}, {"data": ["https://iotait.tech/-6", 4, 0, 0.0, 4109.25, 3052, 5357, 4014.0, 5357.0, 5357.0, 5357.0, 0.373238779509191, 47.80663898479052, 0.19755411962302882], "isController": false}, {"data": ["https://iotait.tech/-20", 4, 0, 0.0, 266.0, 261, 273, 265.0, 273.0, 273.0, 273.0, 0.5614035087719298, 0.768640350877193, 0.27631578947368424], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/e8dac28151c0ddbb.css", 4, 0, 0.0, 275.75, 271, 283, 274.5, 283.0, 283.0, 283.0, 0.5671345526726216, 0.9105168013611229, 0.2038139798667234], "isController": false}, {"data": ["https://iotait.tech/-5", 4, 0, 0.0, 844.5, 261, 1790, 663.5, 1790.0, 1790.0, 1790.0, 0.5782853838369235, 3.0128442605175656, 0.30495518288275264], "isController": false}, {"data": ["https://iotait.tech/-8", 4, 0, 0.0, 4303.75, 3216, 5755, 4122.0, 5755.0, 5755.0, 5755.0, 0.40758100672508657, 55.143640462604445, 0.21612938149582228], "isController": false}, {"data": ["https://iotait.tech/-7", 4, 0, 0.0, 3267.5, 1604, 4922, 3272.0, 4922.0, 4922.0, 4922.0, 0.38369304556354916, 36.72624400479616, 0.20121402877697842], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/9adbdbe4f65db4c9.css", 4, 0, 0.0, 271.0, 263, 282, 269.5, 282.0, 282.0, 282.0, 0.5845389449072045, 1.8009964562326466, 0.2100686833260266], "isController": false}, {"data": ["Test", 4, 0, 0.0, 16281.5, 11807, 19777, 16771.0, 19777.0, 19777.0, 19777.0, 0.17632797002424508, 179.8448003912277, 3.8382328631254135], "isController": true}, {"data": ["https://iotait.tech/_next/static/css/b61ac2a384eb4aa7.css", 4, 0, 0.0, 266.75, 264, 268, 267.5, 268.0, 268.0, 268.0, 0.5841121495327103, 0.17169702832943926, 0.259542019567757], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/4060819d1cd0c31d.css", 4, 0, 0.0, 452.75, 268, 1002, 270.5, 1002.0, 1002.0, 1002.0, 0.5840268652358008, 0.8794623302671922, 0.20988465469411594], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/45f254b11aa40c47.css", 4, 0, 0.0, 596.5, 517, 805, 532.0, 805.0, 805.0, 805.0, 0.5614823133071308, 3.6748578747894443, 0.20178270634475015], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/d8277bf77f0b575e.css", 4, 0, 0.0, 859.5, 776, 1062, 800.0, 1062.0, 1062.0, 1062.0, 0.5302929868752485, 9.432379358345486, 0.19057404215829246], "isController": false}, {"data": ["https://iotait.tech/-19", 4, 0, 0.0, 266.0, 260, 273, 265.5, 273.0, 273.0, 273.0, 0.5603025633842275, 0.48369869729654014, 0.27632108838772934], "isController": false}, {"data": ["https://iotait.tech/-18", 4, 0, 0.0, 264.0, 260, 272, 262.0, 272.0, 272.0, 272.0, 0.5526388505111909, 1.38915273556231, 0.27038287510361975], "isController": false}, {"data": ["https://iotait.tech/", 4, 0, 0.0, 10786.0, 7192, 13152, 11400.0, 13152.0, 13152.0, 13152.0, 0.23277467411545624, 225.14368835108237, 3.9596699691573556], "isController": false}, {"data": ["https://iotait.tech/-17", 4, 0, 0.0, 272.5, 267, 282, 270.5, 282.0, 282.0, 282.0, 0.5541701302299806, 0.2581437032418953, 0.2976499722914935], "isController": false}, {"data": ["https://iotait.tech/-16", 4, 0, 0.0, 264.75, 259, 271, 264.5, 271.0, 271.0, 271.0, 0.542667209333876, 0.24483618233618232, 0.2877620065120065], "isController": false}, {"data": ["https://iotait.tech/-15", 4, 0, 0.0, 267.25, 260, 275, 267.0, 275.0, 275.0, 275.0, 0.5386479935362241, 2.009409507137086, 0.28668276999730674], "isController": false}, {"data": ["https://iotait.tech/-14", 4, 0, 0.0, 1612.75, 798, 2764, 1444.5, 2764.0, 2764.0, 2764.0, 0.5169962517771747, 21.849655066563265, 0.274654258756624], "isController": false}, {"data": ["https://iotait.tech/-13", 4, 0, 0.0, 1075.5, 519, 2142, 820.5, 2142.0, 2142.0, 2142.0, 0.5261081152176773, 17.916447454951992, 0.27538471655925295], "isController": false}, {"data": ["https://iotait.tech/-12", 4, 0, 0.0, 605.75, 288, 834, 650.5, 834.0, 834.0, 834.0, 0.518000518000518, 4.390863765863766, 0.27063503626003627], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/1f0f629f162b170f.css", 4, 0, 0.0, 268.25, 263, 271, 269.5, 271.0, 271.0, 271.0, 0.5729017473503294, 0.5991970423947293, 0.20588656545402462], "isController": false}, {"data": ["https://iotait.tech/-11", 4, 0, 0.0, 6042.5, 3693, 7533, 6472.0, 7533.0, 7533.0, 7533.0, 0.3162555344718533, 54.02256038504112, 0.1655400063251107], "isController": false}, {"data": ["https://iotait.tech/-10", 4, 0, 0.0, 1523.25, 1319, 2041, 1366.5, 2041.0, 2041.0, 2041.0, 0.4624812117007746, 24.624414672216442, 0.2416283674413227], "isController": false}, {"data": ["https://iotait.tech/-32", 4, 0, 0.0, 267.5, 261, 274, 267.5, 274.0, 274.0, 274.0, 0.597460791635549, 2.999556572068708, 0.29698002240477966], "isController": false}, {"data": ["https://iotait.tech/-31", 4, 0, 0.0, 577.5, 275, 1275, 380.0, 1275.0, 1275.0, 1275.0, 0.5871990604815032, 28.57491834263065, 0.31022919113329417], "isController": false}, {"data": ["https://iotait.tech/-30", 4, 0, 0.0, 15.75, 12, 23, 14.0, 23.0, 23.0, 23.0, 0.6096631611034904, 1.5691086534064929, 0.32626505105928977], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/ef46db3751d8e999.css", 4, 0, 0.0, 267.0, 262, 270, 268.0, 270.0, 270.0, 270.0, 0.5675368898978433, 0.20451280505107833, 0.20395856980703744], "isController": false}, {"data": ["https://iotait.tech/-2", 4, 0, 0.0, 2659.25, 2116, 3457, 2532.0, 3457.0, 3457.0, 3457.0, 0.45589240939138365, 29.944206604741282, 0.23595993845452476], "isController": false}, {"data": ["https://iotait.tech/-1", 4, 0, 0.0, 1280.25, 274, 2236, 1305.5, 2236.0, 2236.0, 2236.0, 0.5365526492287056, 0.6795984238765929, 0.2619885982562039], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/3ab3f7cb1da3328d.css", 4, 0, 0.0, 638.0, 271, 1002, 639.5, 1002.0, 1002.0, 1002.0, 0.5245213742460005, 1.3604773144505637, 0.18849986886965642], "isController": false}, {"data": ["https://iotait.tech/-4", 4, 0, 0.0, 3692.0, 2923, 4636, 3604.5, 4636.0, 4636.0, 4636.0, 0.41749295480638765, 37.43778376474272, 0.22097771631353721], "isController": false}, {"data": ["https://iotait.tech/-3", 4, 0, 0.0, 1420.25, 810, 2685, 1093.0, 2685.0, 2685.0, 2685.0, 0.5356186395286556, 4.686663095875737, 0.2772244911622925], "isController": false}, {"data": ["https://iotait.tech/-0", 4, 0, 0.0, 1987.0, 1299, 2752, 1948.5, 2752.0, 2752.0, 2752.0, 0.45761354536094273, 12.333668201578767, 0.22031589635053198], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/c41db919a492bc23.css", 4, 0, 0.0, 270.25, 263, 274, 272.0, 274.0, 274.0, 274.0, 0.5814798662596308, 0.522423317342637, 0.2089693269370548], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/69383284b1527f6a.css", 4, 0, 0.0, 400.0, 270, 533, 398.5, 533.0, 533.0, 533.0, 0.564334085778781, 2.885047792042889, 0.20280756207674944], "isController": false}, {"data": ["https://iotait.tech/_next/static/css/b4faa1f47b5c481e.css", 4, 0, 0.0, 595.25, 520, 797, 532.0, 797.0, 797.0, 797.0, 0.545404963185165, 4.210377181619853, 0.19600490864466869], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 188, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
