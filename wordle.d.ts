interface WorldleState {
  boardState: string[];
  evaluations: (("correct" | "present" | "absent")[] | null)[];
  gameStatus: string;
  hardMode: boolean;
  lastCompletedTs: number | null;
  lastPlayedTs: number | null;
  restoringFromLocalStorage: null;
  rowIndex: 0 | 1 | 2 | 3 | 4;
  solution: string;
}
