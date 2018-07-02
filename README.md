### timedata

Simple script to see the average time it takes me to complete various story point amounts.

### My Workflow

Probably not of much use to other people (unless your workflow is the same as mine). My workflow is as follows:

- Use [toggl](https://toggl.com/) to track time spent working on stuff
    - Add a workspace, as well as a "Building" project
    - In the description, make sure you include the PR number (like "#1234" with the # symbol)
    - I also have an "Addressing CR" project (for when I'm fixing issues that come up in CR), which I also track
- Use [ZenHub](https://www.zenhub.com/) to attach Story Point estimates to GitHub tickets.

Of course, all of this will go out the window when my team migrates to Jira, but for now this works. 🙃

### Usage

This is mostly customized to my own workflow, but you can try it out as well if you want:

```
git clone git@github.com:himynameisdave/timedata.git
cd timedata/
npm install
touch .env
# Add `TOGGL_API_TOKEN=12345678` and `ZENHUB_API_TOKEN=abcdefgh` to .env file
open .env
# Edit constants file to point to your own Toggl workspace & ZenHub repo ID
open constants.js
```

### Reports

You can check out the reports I've generated [over here](https://github.com/himynameisdave/timedata/tree/master/reports).
