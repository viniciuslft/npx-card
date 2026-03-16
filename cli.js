#!/usr/bin/env node

const { renderCard } = require("./index");

const args = process.argv.slice(2);

const options = {
  json: args.includes("--json") || args.includes("-j")
};

console.log(renderCard(options));