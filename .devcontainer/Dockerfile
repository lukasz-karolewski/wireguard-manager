FROM mcr.microsoft.com/devcontainers/base:ubuntu

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends wireguard \ 
    && apt-get -y install python3 python3-pip python3-venv

# Install Docker CLI
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common \
&& curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg \
&& add-apt-repository \
    "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable" \
&& apt-get update && apt-get install -y docker-ce-cli

RUN pip3 install --no-cache-dir langchain langchain-openai python-dotenv