"""This module is for db object"""


class Database:
    database_name = ""
    collection = ""
    username = ""
    password = ""
    host = ""
    port = ""

    def __init__(self, database_name, username, password, host, port):
        """Initial the db object"""
        self.database_name = database_name
        self.username = username
        self.password = password
        self.host = host
        self.port = port
