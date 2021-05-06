FROM node:12

USER root
RUN apt-get update
RUN apt-get -y install rsyslog
# RUN apt-get -y install libseccomp-dev

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
RUN echo "export PATH=~/.cargo/bin:$PATH" >> ~/.bashrc

RUN npm install --global neon-cli

WORKDIR /home/

RUN apt-get -y install gperf
RUN wget https://github.com/seccomp/libseccomp/releases/download/v2.5.1/libseccomp-2.5.1.tar.gz
RUN tar xvf libseccomp-2.5.1.tar.gz
WORKDIR /home/libseccomp-2.5.1
RUN ./configure
RUN make
RUN make install
RUN cp /usr/local/lib/libseccomp.so.2 /usr/lib

COPY ./ /home/rusty-seccomp
WORKDIR /home/rusty-seccomp

RUN /bin/bash -c "source $HOME/.cargo/env"
# RUN neon build --release