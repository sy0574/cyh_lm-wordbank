
source ./flow-arg.sh
echo $CI_SOURCE_NAME
echo $CI_COMMIT_REF_NAME

app=$CI_SOURCE_NAME
echo app:$app
appname=$CI_SOURCE_NAME
echo appname:$appname
env=$CI_COMMIT_REF_NAME
echo env:$env

appfullname=${app}-${env}
echo appfullname:$appfullname


replicas=1
requestsCpu=1m
requestsMemory=32Mi

dockerEnd=''


echo 'sed Deployment.yaml'
sed -i "s#\${name}#appfullname#g" Deployment.yaml
echo 'sed Deployment.yaml'
sed -i "s#\${namespace}#bolone#g" Deployment.yaml
echo 'sed Deployment.replicas'
sed -i "s#\${replicas}#$replicas#g" Deployment.yaml

echo 'sed Deployment.request'
sed -i "s#\${requestsCpu}#$requestsCpu#g" Deployment.yaml
sed -i "s#\${requestsMemory}#$requestsMemory#g" Deployment.yaml

ingressHost=${app}.bolone.cn
echo 'sed Deployment.ingressHost'
sed -i "s#\${ingressHost}#$ingressHost#g" Deployment.yaml

ingressHost2=${app}.bolone.cn
echo 'sed Deployment.ingressHost2'
sed -i "s#\${ingressHost2}#$ingressHost2#g" Deployment.yaml

ingressHostSsl=${app}.bolone.cn
echo 'sed Deployment.ingressHostSsl'
sed -i "s#\${ingressHostSsl}#$ingressHostSsl#g" Deployment.yaml

cat Deployment.yaml



cat Dockerfile
echo 'sed dockerEnd Dockerfile'
sed -i "s#\${dockerEnd}#${dockerEnd}#g" Dockerfile
cat Dockerfile

echo 'over and over'

# read Arg
