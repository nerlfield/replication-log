# replication-log

## task description:

The Replicated Log should have the following deployment architecture: one Master and any number of Secondaries.

Replication log service where there are two parts: master and secondary.

Master should expose simple HTTP server with: 

- POST method - appends a message into the in-memory list
- GET method - returns all messages from the in-memory list

Secondary should expose simple  HTTP server with:

GET method - returns all replicated messages from the in-memory list

Properties and assumptions:
- after each POST request, the message should be replicated on Secondary servers
- Master should ensure that Secondaries have received a message via ACK
- POST request should be finished only after receiving ACKs from all Secondaries (blocking replication approach)
- to test that the replication is blocking, introduce the delay/sleep on the Secondary
- on this stage assume that communication channel is a perfect link (no failures and messages lost)
- any RPC frameworks can be used for Master-Secondary communication (Sockets, language-specific RPC, HTTP, Rest, gRPC, …)
- Master and Secondaries should run in Docker


# How to run:

For run master dockerfile:

## Master:

- build: `docker build -t master -f master.Dockerfile .`
- run: `docker run -p 5100:8000 master`

## Secondary:

- build: `docker build -t secondary -f secondary.Dockerfile .`
- run: `docker run -p 5200:8000 secondary`