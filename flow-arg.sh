
PIPELINE_ID=${PIPELINE_ID}					# 流水线 ID
BUILD_NUMBER=${BUILD_NUMBER}				# 流水线的运行编号，从1开始，按自然数自增
PIPELINE_NAME=${PIPELINE_NAME}				# 流水线名称，比如“前端项目发布”
PROJECT_DIR=${PROJECT_DIR}					# 运行命令的工作目录，比如”/root/workspace/1084-abc_docker-08191_b0wE”
DATETIME=${DATETIME}						# 当前时间戳，比如2017-06-22-23-26-33
TIMESTAMP=${TIMESTAMP}						# 当前时间戳，比如 1581581273232

CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME}		# 代码库的分支名或者 Tag 名（根据用户运行时选择），比如 master or V1.0
# CI_COMMIT_TITLE=${CI_COMMIT_TITLE}			# 最后一次提交的提交信息
CI_COMMIT_SHA=${CI_COMMIT_SHA}				# 最后一次提交的代码版本的 commit ID：如2bfb63d779e3648c91950f82d374a25784cdabaf
CI_COMMIT_ID=${CI_COMMIT_ID}				# 最后一次提交的代码版本的 8 位 commit ID
CI_SOURCE_NAME=${CI_SOURCE_NAME}				# 代码源名称

VUE_GITHUB_USER_NAME=${VUE_GITHUB_USER_NAME}
VUE_APP_SECRET_KEY=${VUE_APP_SECRET_KEY}

slbDomain=${slbDomain}

