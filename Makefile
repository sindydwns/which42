TARGET = app.zip
SRC = \
	Routers/*.js \
	DataBase/*.js \
	slack/*.js \
	slack/utils/*.js \
	api42.js \
	apiSlack.js \
	app.js \
	error.js \
	log.js \
	apiDataBase.js \
	package.json \
	Schedule/schedule.js \
	constants.js

$(TARGET): $(SRC)
	zip -r $@ $^

all: $(TARGET)

fclean:
	rm -rf $(TARGET)

re:	fclean
	make all

.PHONY: all fclean re
