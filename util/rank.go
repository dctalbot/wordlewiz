package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
)

type Tree struct {
	word        string
	rank        float32
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
	fmt.Println(t.rank)
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

	// freq is a global letter frequency map
	freq := make(map[rune]int, 26)

	// pos is a position-aware letter frequency that acts as a weight
	pos := make(map[int]map[rune]int, 5)
	for i := 0; i < 5; i++ {
		pos[i] = make(map[rune]int, 26)
	}
	for _, word := range words {
		for i, char := range word {
			freq[char]++
			pos[i][char]++
		}
	}

	getRank := func(w string) (result float32) {

		for i, r := range w {
			if strings.Contains(w[:i], string(r)) {
				continue
			}
			result += (float32(freq[r]*pos[i][r]) / float32(len(words)))
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
