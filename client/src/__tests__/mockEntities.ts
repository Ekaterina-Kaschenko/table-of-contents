export const mockEntities = {
  pages: {
    Getting_started: {
      id: "Getting_started",
      title: "Getting started",
      url: "getting-started.html",
      parentId: undefined,
      level: 0,
      tabIndex: 0,
      doNotShowWarningLink: true,
      pages: ["First_steps", "Customization"]
    },
    First_steps: {
      id: "First_steps",
      title: "First steps",
      url: "first-steps.html",
      parentId: "Getting_started",
      level: 1,
      tabIndex: 0,
      doNotShowWarningLink: true,
      pages: ["Installation", "Hello_World"]
    },
    Installation: {
      id: "Installation",
      title: "Installation guide",
      url: "installation.html",
      parentId: "First_steps",
      level: 2,
      tabIndex: 0,
      doNotShowWarningLink: true
    },
    Hello_World: {
      id: "Hello_World",
      title: "Creating your first app",
      url: "hello-world.html",
      parentId: "First_steps",
      level: 2,
      tabIndex: 0,
      doNotShowWarningLink: true
    },
    Customization: {
      id: "Customization",
      title: "UI Customization",
      url: "customization.html",
      parentId: "Getting_started",
      level: 1,
      tabIndex: 0,
      doNotShowWarningLink: true,
      pages: ["Themes"]
    },
    Themes: {
      id: "Themes",
      title: "Themes and Appearance",
      url: "themes.html",
      parentId: "Customization",
      level: 2,
      tabIndex: 0,
      doNotShowWarningLink: true
    }
  },
  anchors: {
    Theme_Settings: {
      id: "Theme_Settings",
      title: "Theme Settings",
      url: "themes.html",
      anchor: "#theme-settings",
      level: 3
    }
  },
  topLevelIds: ["Getting_started"]
};
