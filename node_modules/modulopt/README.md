<img id="module-logo" src="https://raw.githubusercontent.com/ManuUseGitHub/modulopt/master/logo.svg">

# Modul °/o pt
[![npm version](https://badge.fury.io/js/modulopt.svg)](https://badge.fury.io/js/modulopt) [![Build Status](https://app.travis-ci.com/ManuUseGitHub/modulopt.svg?branch=master)](https://travis-ci.com/ManuUseGitHub/modulopt) [![Coverage Status](https://coveralls.io/repos/github/ManuUseGitHub/modulopt/badge.svg)](https://coveralls.io/github/ManuUseGitHub/modulopt) ![GitHub issues](https://img.shields.io/github/issues/ManuUseGitHub/modulopt) [![Maintainability](https://api.codeclimate.com/v1/badges/e3c7a4af56202c0f5669/maintainability)](https://codeclimate.com/github/ManuUseGitHub/modulopt/maintainability) ![Code Climate technical debt](https://img.shields.io/codeclimate/tech-debt/ManuUseGitHub/modulopt) ![NPM Downloads](https://img.shields.io/npm/dm/modulopt.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-61dafb.svg)](https://github.com/ManuUseGitHub/modulopt/blob/master/LICENSE)

# Purpose
Any good product delivered on a large scale should provide good quality for the service it gives or the problem it is in charge to solve. To ensure a maximum quality level, services should also cover as many as possible use-cases by providing options in the input.

The downside of designing powerful option management is quite time-consuming. Moreover, there is no clear formalism defined or convention about any option design other than: "An option has to be optional and if not specified in the input, that option has to keep the default value".

The philosophy of this module is to ease the pain of designing option management. In response to "how can I design that?" it answers by saying: **"You don't have to, I got you covered"**.

Go on the Heroku page to be **[getting started](https://modulopt-doc.herokuapp.com/#11-getting-started)** and have all the **[documentation](https://modulopt-doc.herokuapp.com/#11-getting-started)** you need.

---

Links: [GIT REPO](https://github.com/ManuUseGitHub/modulopt) | [NPM](https://www.npmjs.com/package/modulopt) | [DOCUMENTATION](https://modulopt-doc.herokuapp.com) | [MIT LICENSE](https://raw.githubusercontent.com/ManuUseGitHub/modulopt/master/LICENSE)

---

## Features
- adds an `options` property with your ready to use options.
- handle mismatching options (defaults etc.).
- set options on the go easily.
- adds a `modulopt` property with 
  - `config` : generated using modulopt generation.
  - `defaults` : with the default values.
  - `logs` : for modulopt silent debugging.
  - ...
- reset modulopt logs
- flexibility
  
## Noticeable changes
- 2.1.0
  - modulopt constants
  - **4Miss** Interactions: whenever an option mismatches a defined name or a proposition is misspelled or even a free option containing a structured object has a mysterious application.
- 2.0.0
  - The service is provided by Modulopt Object
  - Modulopt config for a generation: mismatch handling, option order while generated. `modulopt` special definition
  - Logging
  - Chimerical cases
  - Set Options via multiple inputs (string and object)
- 1.0.0
  - Default management
  - Use of `.options` to get access to options
  - `modulopt` property on the desired object
  - Masks usage.

## Demo
[Runkit demo](https://runkit.com/manuusegithub/modulopt)
