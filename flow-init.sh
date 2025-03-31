source ./flow-arg.sh
echo $CI_COMMIT_REF_NAME # CI_COMMIT_REF_NAME 代码库的分支名
CI_COMMIT_REF_NAME_array=(${CI_COMMIT_REF_NAME//-/ })
owner=${CI_COMMIT_REF_NAME_array[0]}  # owner
app=${CI_COMMIT_REF_NAME_array[1]}    # app
subapp=${CI_COMMIT_REF_NAME_array[2]} # subapp
env=${CI_COMMIT_REF_NAME_array[3]}    # env [dev/fat/uat/pro]

echo owner:$owner
echo app:$app
echo subapp:$subapp
echo env:$env

appname=${owner}-${app}-${subapp}
echo appname:$appname

apppath=src/syweb5/pro/$app
echo apppath:$apppath


replicas=1
requestsCpu=1m
requestsMemory=32Mi

dockerEnd=''


echo 'sed Deployment.yaml'
sed -i "s#\${name}#$CI_COMMIT_REF_NAME#g" Deployment.yaml
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

echo 'sed VUE_GITHUB_USER_NAME .env'
sed -i "s#\${VUE_GITHUB_USER_NAME}#${VUE_GITHUB_USER_NAME}#g" .env

echo 'sed VUE_APP_SECRET_KEY .env'
sed -i "s#\${VUE_APP_SECRET_KEY}#${VUE_APP_SECRET_KEY}#g" .env

echo 'sed app .env'
sed -i "s#\${app}#${app}#g" .env

echo 'sed owner .env'
sed -i "s#\${owner}#${owner}#g" .env
echo 'sed subapp .env'
sed -i "s#\${subapp}#${subapp}#g" .env
echo 'sed env .env'
sed -i "s#\${env}#${env}#g" .env

apiurl=http://api.${app}.bolone.cn/
echo apiurl:$apiurl

apiurl=https://${app}-api.bolone.cn/
echo apiurl:$apiurl



uniurl=https://${app}-h5.bolone.cn/
echo uniurl:$uniurl

echo 'sed apiurl .env'
sed -i "s#\${apiurl}#${apiurl}#g" .env

echo 'sed apiurl2 .env'
sed -i "s#\${apiurl2}#${apiurl2}#g" .env

echo 'sed uniurl .env'
sed -i "s#\${uniurl}#${uniurl}#g" .env

cat .env

cat Dockerfile
echo 'sed dockerEnd Dockerfile'
sed -i "s#\${dockerEnd}#${dockerEnd}#g" Dockerfile
cat Dockerfile

echo 'over and over'

# read Arg
