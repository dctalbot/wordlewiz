.PHONY: src/words.json
src/words.json:
	go run util/rank.go $@
