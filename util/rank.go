package main

import (
	"encoding/json"
	"log"
	"os"
	"strings"
)

type Tree struct {
	word        string
	rank        int
	left, right *Tree
}

func (t *Tree) IsZero() bool {
	var z *Tree
	return t == z
}

func (t *Tree) Add(new *Tree) {

	if t.IsZero() {
		t.word = new.word
		t.rank = new.rank
		return
	}

	if new.rank > t.rank {

		if t.left.IsZero() {
			t.left = new
		} else {
			t.left.Add(new)
		}
		return
	}

	if t.right.IsZero() {
		t.right = new
	} else {
		t.right.Add(new)
	}
}

func (t *Tree) Print(acc *[]string) {
	if !t.left.IsZero() {
		t.left.Print(acc)
	}
	*acc = append(*acc, t.word)
	if !t.right.IsZero() {
		t.right.Print(acc)
	}
}

func main() {
	data, err := os.ReadFile(os.Args[1])
	if err != nil {
		log.Fatal("read file")
	}

	var words []string
	err = json.Unmarshal(data, &words)
	if err != nil {
		log.Fatal("parse json")
	}

	if len(words) == 0 {
		log.Fatal("no words to rank")
	}

	freq := make(map[rune]int, 26)
	for _, word := range words {
		for _, char := range word {
			freq[char]++
		}
	}

	getRank := func(w string) (result int) {

		for i, r := range w {
			if strings.Contains(w[:i], string(r)) {
				continue
			}
			result += freq[r]
		}

		return result
	}

	tree := Tree{}

	for _, word := range words {
		tree.Add(&Tree{
			word: word,
			rank: getRank(word),
		})
	}

	var acc []string
	tree.Print(&acc)
	data, err = json.Marshal(acc[:len(acc)-1])
	if err != nil {
		log.Fatal("transform to json")
	}

	os.WriteFile(os.Args[1], data, 777)

}