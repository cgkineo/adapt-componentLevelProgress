# adapt-titleLevelProgress  

<img src="https://github.com/cgkineo/adapt-titleLevelProgress/wiki/adapt-clp.gif.gif" alt="page level progress bar clicked and drawer opening, showing completion status of components">    

This extension displays the learner's progress through a page. 

## Settings Overview

The attributes listed below are used in *components.json* to configure **Title Level Progress**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-titleLevelProgress/blob/master/example.json). 

The absence of the **_titleLevelProgress** object in a component, article, block, page and menu model is interpreted as having **Title Level Progress** enabled (`"_isEnabled": true`). Blocks, articles, pages and menus with default to having (`"_showIndicator": false`), components will default to having (`"_showIndicator": true`). Aria levels will default to 1 for contentObjects, 2 for articles, 3 for blocks and 4 for components.

The same **_titleLevelProgress** object may be added to the course (*course.json*). At this level, `"_isEnabled"` can be used to disable **Title Level Progress** on components and contentObjects that have `"_isEnabled": true`.  
>**Note:** Setting the **_titleLevelProgress** object in *course.json* does not provide defaults for components, blocks, articles or contentObjects. It cannot be used to enable **Title Level Progress** on components, blocks, articles or contentObjects that have `"_isEnabled": false` or that do not have the **_titleLevelProgress** object in their model json.

### Attributes

#### course
**_titleLevelProgress** (object):  The Title Level Progress object.  
>**_isEnabled** (boolean): Turns title aria completion labels on/off`.  
>**_ariaLevels** (object): Set default aria levels for content types. [*example.json*](https://github.com/cgkineo/adapt-titleLevelProgress/blob/master/example.json)  

#### menu/page/article/block/component
**_titleLevelProgress** (object):  The Title Level Progress object.  
>**_isEnabled** (boolean): Turns title aria completion labels on/off`.  
>**_showIndicator** (boolean): Turns the visual completion indicator on/off.  
>**_ariaLevel** (number): Adds a title aria level.  
  
  
<div float align=right><a href="#top">Back to Top</a></div> 

## Limitations
 
No known limitations.  

----------------------------
**Version number:**  2.0.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a> 
**Framework versions:**  2.0     
**Author / maintainer:** Kineo   
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge 12, IE 11, IE10, IE9, IE8, IE Mobile 11, Safari iOS 9+10, Safari OS X 9+10, Opera    
