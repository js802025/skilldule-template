# skilldule-template
 A schedule viewer for schools that includes features such as auto importing, lunch, homework, assemblies, and chats.

## Skilldule

![Skilldule Main Page](https://i.ibb.co/YkHrssR/image.png)<br/>
Skilldule is a schedule viewer I made in the summer of 2021 for my high school. Since its creation, I've added features such as viewing the lunch, assemblies, homework and most recently chats(using discord). The idea is to have everything very easily accessible and in one place. As I was preparing the schedule for this year, I started a rewrite of the code as it was a bit of a mess lol. As I was rewriting I decided to make a template(this repo). This template should allow any school that would wish, with a bit of set up to have their own version of skilldule. 



## The Template
Essientially the way the template works is that there is a file for each of the following essiential things:
- Schedule
- Lunch
- Homework
- Assemblies
- Processing the Classes from the auto grabber
Each of these files has a function that will need to return info in a specified format.
You will need to modify these functions to process these elements for your school.
Then the main file will take all this info and present it to the user in a a unified way.

### Config File
To get started youw will need to fill out certain info in the config file such as,
- Base URL
- Import Method (Myschoolapps(portal) or googleclassroom(gc))
- Discord Token/App Info (If using skilldule chats)
- Google Classroom Api Info (If importing homework from google classroom)

## Setting Up Your Skilldule
### Follow the Template
After you follow the guidelines above you should be able to set up your skilldule on a hosting service and start sharing it with others.
(readthedocs coming soon)
### Custom Setups
If you are an organization looking to setup skilldule for your school, feel free to [sponsor me](https://github.com/sponsors/js802025?frequency=one-time&sponsor=js802025) and I'll be happy to set up skilldule for your school.