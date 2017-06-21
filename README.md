# adapt-componentLevelProgress  

<img src="https://github.com/cgkineo/adapt-componentLevelProgress/wiki/adapt-clp.gif.gif" alt="page level progress bar clicked and drawer opening, showing completion status of components">    

This extension displays the learner's progress through a page. 

## Settings Overview

The attributes listed below are used in *components.json* to configure **Component Level Progress**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/blob/master/example.json). 

The absence of the **_componentLevelProgress** object in a component model is interpreted as that component having **Component Level Progress** enabled (`"_isEnabled": true`). 

The same **_componentLevelProgress** object may be added to the course (*course.json*). At this level, `"_isEnabled"` can be used to disable **Component Level Progress** on components and contentObjects that have `"_isEnabled": true`.  
>**Note:** Setting the **_componentLevelProgress** object in *course.json* does not provide defaults for components or contentObjects. It cannot be used to enable **Component Level Progress** on components or contentObjects that have `"_isEnabled": false` or that do not have the **_componentLevelProgress** object in their model json.

### Attributes

**_componentLevelProgress** (object):  The Component Level Progress object that contains a value for **_isEnabled**.  

>**_isEnabled** (boolean): Turns **Component Level Progress** on and off. Acceptable values are `true` and `false`. 

### Accessibility
Several elements of **Component Level Progress** have been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **pageLevelProgress**, **pageLevelProgressIndicatorBar**, and **pageLevelProgressEnd**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. Should the label texts need to be customised, they can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/blob/master/properties.schema).   
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
