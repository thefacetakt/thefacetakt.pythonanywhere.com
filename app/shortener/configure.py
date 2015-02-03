import os

SERVER_URL = input("Enter a server URL (short)")
config = open(os.path.dirname(__file__) + "/config.py", "w")
print("SERVER_URL = \"", SERVER_URL, "\"", sep="", file=config)
config.close()

