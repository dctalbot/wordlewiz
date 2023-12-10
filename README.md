# wordlewiz

A browser extension for the [Wordle](https://www.nytimes.com/games/wordle) game that recommends guesses to a user.

This was thrown together quickly, but it's a fun demo, and it was cool to see how much progress has been made on PWAs and service workers. It's a much better DX than just a few years ago.

![demo](./demo.gif)

## How it works

One of the most limiting constraints in Wordle is the requirement that each guess be a valid 5-letter word in English. This drops the problem space from what would have been 11,881,376 (26^5) solutions down to about 5,000.

5k 5-letter words is almost nothing to store and process, so we can import one such [dictionary](./src/words.json) as a starting point.

Now, the interesting part is how we rank these words in order of best-next-guess. There are a few characteristics that make for a good guess. The first is:

1. Its letters don't conflict with anything known about the solution (any info garnered from previous guesses)

Well, that's sensible, but it doesn't help us on the first guess.

2. Its letters are more likely to be present in the solution (yellow/green)

This gives us something to work with. Many people know "RLSTNE" from the Wheel of Fortune and use that as a basis for a guess, but the real order of letter frequency in English is more like "EARIOTNSL". However, this is considering **all** words in english. We don't need to consider all words -- only 5-letter words, so instead we can create a letter frequency map for each character (a-z) in every word in the dictionary.

Note: we don't double-weight words that contain the same letter more than once since on the first guess, providing 5 distinct letters is more productive. With this, we get a ranking like the following:

```json
[
  "arose",
  "aloes",
  "stoae",
  "arise",
  "raise",
  "earls",
  "laser",
  "reals",
  "aster",
  "rates",
  ...
]
```

This suggests that the letters "a", "r", "o", "s" and "e" are among the most common in the dictionary and thus will lend themselves to future guesses and/or the solution.

3. Its letters are more likely to be present in the solution _and_ in the correct position (green)

If we also add a weight to account for the positions of the letters, the rankings change quite a bit:

```json
[
  "tares",
  "cares",
  "dares",
  "pares",
  "bares",
  "tales",
  "mares",
  "hares",
  "fares",
  "nares",
  ...
]
```

This suggests that many words begin with the letter "t", many words have "a" as the second character, and many words end in "s" etc.

In this example, the global letter frequency and the positional letter frequency are weighed 50/50, but these parameters can be tuned.

In theory, the ideal ranking could be found by running a simulation using every possible wordlist.

```go
bestWordlist := []
min := 5.0
for solution := range words {
    guessCount := 0
    for wordList := range getPermutations(words) {
        guessCount += runSimulation(solution, wordList) // returns #guesses to reach solution
    }
    avg := guessCount / len(wordList)
    if avg < min {
        bestWorldlist = wordList
        min = avg
    }
}
```

But this is cost prohibitive. I do not know what 5000! evaluates to, but I know it is too big.

Instead, the weights of the global letter frequency and the positional letter frequency could be adjusted, and the resulting wordlists could be evaluated in a similar fashion.

Unfortunately, I don't feel like doing that, and it seems like the 50/50 weight does a decent job as-is!

Additionally, after each guess, the word list could be re-ranked based on any new constraints (currently, non-viable words are just filtered out of the original list ranking). This would also be a lot of work, but it would surely decrease the average guess count.

# How to install

1. Clone this repo
1. Go to [chrome://extensions/](chrome://extensions/)
1. Enable developer mode
1. Click "load unpacked" and select the dist/ folder of this repo

# How to develop

```
make src/words.json
npm install
npm run dev
```
