const hosts = require('./hosts.json');
const bent = require('bent');
const getJSON = bent('json');
const AWS = require('aws-sdk');

/*
"plan_monthly_data": 1073741824000,
"data_counter": 400544236517,
"data_next_reset": 1595688132,
*/

async function putMetrics(name, value) {
    const metric = {
        MetricData: [ /* required */
            {
                MetricName: name,
                Dimensions: [
                ],
                Timestamp: new Date(),
                Unit: 'Count',
                Value: value
            },
            /* more items */
        ],
        Namespace: 'mops' /* required */
    };

    const cloudwatch = new AWS.CloudWatch({ region: 'us-west-2' });
    console.log("Putting metrics", name, value);
    return new Promise((resolve, reject) => {
        cloudwatch.putMetricData(metric, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
}

async function pullStats(host) {
    const id = host.id;
    const key = host.key;
    const url = `https://api.64clouds.com/v1/getServiceInfo?veid=${id}&api_key=${key}`;
    const result = await getJSON(url);
    const data_total = result.plan_monthly_data;
    const data_now = result.data_counter;
    let percent = Math.floor(data_now * 100 / data_total);
    if(percent > 100)
        percent = 100;
    const data_next_reset = result.data_next_reset;
    const hoursLeft = Math.floor((data_next_reset - Math.floor(new Date() / 1000)) / 3600)
    const result1 = await putMetrics(`data.usage.${host.name}.percent`, percent);
    console.log(result1);
    const result2 = await putMetrics(`data.usage.${host.name}.reset`, hoursLeft);
    console.log(result2);
}

exports.handler = async (event) => {

    for(const host of hosts) {
        await pullStats(host);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Complete'),
    };
    return response;
};
