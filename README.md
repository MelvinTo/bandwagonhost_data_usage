## A lambda function to pull usage stats from bandwagonhost and store results to cloudwatch

### Usage
* Create a hosts.json and configure bandwagonhost access
* Run `yarn` to install dependancies
* Upload the whole package to aws lambda(you may exclude node_modules/aws-sdk to reduce the package size)
* make sure lambda has the permission to put metrics in CloudWatch

### Example
[Example hosts.json](hosts.example.json)

### Link to get API key
https://kiwivm.64clouds.com/main.php
