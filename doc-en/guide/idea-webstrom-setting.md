# Preface

As the saying goes, "A sharp axe is the carpenter's tool." This article mainly introduces how to configure and debug using IntelliJ IDEA (WebStorm).

## WebStorm or IntelliJ IDEA

Go to settings -> plugins -> install the Prettier plugin.

![1644830890281](https://github.jzfai.top/file/vap-assets/1644830890281.png)

Search for Prettier.

![1644830972897](https://github.jzfai.top/file/vap-assets/1644830972897.png)

Configure file formatting.

```text
{**/*,*}.{js,ts,jsx,tsx,vue,json,scss,less}
```

## Enable ESLint

Go to settings -> search for ESLint.

![1669271684824](https://github.jzfai.top/file/vap-assets/1669271684824.png)

Apply and save. Now, your code will be automatically formatted when you save it.

## Resolve WebStorm or IntelliJ IDEA Lagging Issues

Some users complain that IntelliJ IDEA is laggy and not user-friendly due to some default configurations. Let's address that.

## Configure Save Strategy, Disable Autosave

Autosave causes excessive disk performance consumption, leading to lagging.

##### How to Configure?

Open WebStorm and go to "File" >> "Settings" >> "Appearance & Behavior" >> "System Settings."

First: Save on Active Window Deactivation
Second: Save on Switching to Another Window
Third: Set a Time Interval for Autosave
Fourth: Safe Write, which continuously saves source files.

![1644831274711](https://github.jzfai.top/file/vap-assets/1644831274711.png)

## Adjust Editor Memory

Insufficient editor memory can cause lagging. It is recommended to set it to at least 2048 MB.

![1669272594340](https://github.jzfai.top/file/vap-assets/1669272594340.png)

Restart IntelliJ IDEA for changes to take effect.

## Show Unsaved Changes with Asterisk (*)

The asterisk (*) helps identify unsaved changes.

##### How to Configure?

Go to "Editor" >> "General" >> "Editor Tabs" and check the "Mark modified(*)" option.

![1644831198664](https://github.jzfai.top/file/vap-assets/1644831198664.png)

## Display Memory Usage

Displaying memory usage helps identify the cause of lagging, whether it's due to memory overload.

##### How to Configure?

Double-click "shift" twice, search for "Show Memory Indicator," and enable it.

![1669272218927](https://github.jzfai.top/file/vap-assets/1669272218927.png)

Now, the memory usage number will appear in the bottom right corner.

## Debugging in WebStorm

Debugging in WebStorm is relatively simple.

#### Start the Project

```
npm run dev 
```

![1651887579536](https://github.jzfai.top/file/vap-assets/1651887579536.png)

Get the access link: "localhost:3001."

#### Click on "Edit Configurations"

![1651887837277](https://github.jzfai.top/file/vap-assets/1651887837277.png)

##### Add Debug Configuration

![1651887875228](https://github.jzfai.top/file/vap-assets/1651887875228.png)

![1651887883486](https://github.jzfai.top/file/vap-assets/1651887883486.png)

##### Click on the Debug Button to Start Debugging

![1651887926820](https://github.jzfai.top/file/vap-assets/1651887926820.png)
