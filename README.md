<p align="center">
  <img src="./documents/images/ead-logo.svg" alt="EAD Logo" style="height: 200px; width: 200px"/>
</p>

# EAD (Entity Association Diagram)

EAD is a tool to initialize any Ruby on Rails project quickly by implementing associations from a generated JSON file.

EAD contains two parts;

- A user interface(called 'EAD') to generate JSON file
- A gem(called 'EAD gem' or 'ead') to modify the files of a Ruby on Rails project by using the generated JSON file

This repository contains the code of the user interface.

EAD gem can be accessible from [this repository](https://github.com/ozovalihasan/ead-g) or [rubygems.org](https://rubygems.org/gems/ead) 

![project-gif](./documents/images/project.gif)

## Live Demo

Please check [live demo of EAD.](https://ead.ozovalihasan.com/)

## Built With

- React
- react-beautiful-dnd
- Redux Toolkit
- styled-components
- Jest

## Getting Started

Producing ERD is the first starting point of any Ruby on Rails project. But, implementing ERD to a Ruby on Rails project can be time-consuming and repetitive. 

More, arrows are used to represent associations on ERD. It can be hard to follow these arrows if any entity has a lot of associations.

EAD is designed to solve these two problems. Firstly, EAD is using containers moved by the drag-and-drop gesture. Any container can be collided and expanded. It allows to read associations by going from outer containers to inner ones easily.

Secondly, a JSON file can be produced by using EAD quickly and this JSON file can be implemented into a Ruby on Rails project by EAD gem. So, any project can be started with ready associations without consuming any time.

EAD is not an intermediate step between ERD and the process of adding associations. EAD is developed to be used instead of ERD.
### Prerequisites

- A modern web browser (Firefox or Chrome is suggested).
- A new Ruby on Rails project

### Usage

EAD can be accessible with any modern browser. To learn how to use EAD, check [this document](./documents/how-to-use.md). A JSON file should be generated by the clicking 'Download EAD' button when all associations are ready. 

Install EAD gem by running `gem install ead`.

Then, there are two choices to use the generated JSON file;
- Run `ead 'path_of_the_generated_file'` in the root folder of your Ruby on Rails project. Don't forget to put quotation marks(').
- Move the generated JSON file (its name must be 'EAD.json') to the root folder of your project and run `ead`. 

⚠️: Save your files before running the gem.

⚠️⚠️: Please double-check generated files by the gem.

⚠️⚠️⚠️: EAD is still under development. So, it is not recommended to use this gem with ongoing projects. 


- If all files are generated as expected, run `bundle exec rails db:migrate`

### Features

- Any container can be collided by using ![collide button](./documents/images/collide.png) and expanded ![expand button](./documents/images/expand.png).
- Containers in another container can be aligned vertically by using ![vertical button](./documents/images/align-vertical.png) and horizontally by using ![horizontal button](./documents/images/align-horizontal.png).
- Any drop area can be chosen to work by using flag (checkbox without flag ![flag-uncheck](./documents/images/flag-uncheck.png) and with flag ![flag-check](./documents/images/flag-check.png) ).
  * Selected containers' color is ![blue-selected](./documents/images/blue-selected.png).
- All enabled containers can be moved with ![move-enable](./documents/images/move-enable.png). Disabled containers cannot be moved(![move-disable](./documents/images/move-disable.png)). 
  * Enabled containers' color can be any of ![blue-1](./documents/images/blue-1.png) ![blue-2](./documents/images/blue-2.png) ![blue-3](./documents/images/blue-3.png).
  * The color of disabled containers and drop areas is ![gray](./documents/images/gray.png).
  * The color of coupled dragged containers and drop areas is ![yellow](./documents/images/yellow.png).
  * The color of dragged containers being removed is ![red](./documents/images/red.png).
- All entities can be cloned by using ![clone](./documents/images/clone.png). The color of clone entities is ![orange](./documents/images/orange.png). 
- EAD can be reset to the initial state by clicking the 'Reset' button.
- EAD can be saved to localStorage by clicking the 'Save' button.
- EAD can be installed with data from localStorage by clicking the 'Install Saved Data' button.
- All containers can be expanded by clicking the 'Expand All' button.

⚠️⚠️⚠️: EAD allows to use of any drag containers and drop areas by default. But, it is suggested to select a drop area with the flag ![flag-check](./documents/images/flag-check.png) and then drag any enabled container.

## Run EAD tool locally

- Download [Node.js](https://nodejs.org/en/download/)
- Run `npm install`
- Run `npm start`

## Test EAD

- Clone this repository
- Open terminal
- Change directory by using `cd ead`
- Run `npm install`
- Run `npm test` to test all files

# Authors

Reach out to me at one of the following places!

👤 **Hasan Özovalı**

- Website: [ozovalihasan.com](https://www.ozovalihasan.com/)
- LinkedIn: [Hasan Özovalı](https://www.linkedin.com/in/hasan-ozovali/)
- Github: [@ozovalihasan](https://github.com/ozovalihasan)
- Twitter: [@ozovalihasan](https://twitter.com/ozovalihasan)
- Mail: [ozovalihasan@gmail.com](mailto:ozovalihasan@gmail.com)


## 🤝 Contributing

Contributions, issues and feature requests are welcome! 

Feel free to check the [issues page](https://github.com/ozovalihasan/ead/issues).

## Show your support

Give a ⭐️ if you like this project!

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
 