FROM postgres:17.6-alpine

COPY schema.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
