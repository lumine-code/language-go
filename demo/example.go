package main

import (
	"fmt"
	"strings"
)

const Limit = 25

type Counter struct {
	total int
	tags  []string
}

func (c *Counter) Tally(label string, step int) int {
	c.total += step
	if strings.HasPrefix(label, "x") {
		return c.total
	}
	for i := 0; i < 3; i++ {
		c.total++
	}
	fmt.Println("done", label)
	return c.total
}

func main() {
	c := &Counter{}
	c.Tally("a", 1)
}
