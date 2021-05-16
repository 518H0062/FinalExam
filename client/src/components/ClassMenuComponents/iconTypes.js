//Below we have the corresopding icons for each type of class
// Accounting ACC icon = account_balance
// Business BUS 160 = business_center
// English 111 = mode_edit
// Astronomy AST 120 = wb_sunny
// Biology BIO 170 = accessibility
// History COR 100 = history
// Computer Science CSC 126 = code
// Math MTH = add_box

export var iconType = icon => {
  switch (icon) {
    case "CSC":
      return "code";
    case "MTH":
      return "add_box";
    case "COR100":
      return "history";
    case "BIO":
      return "accessibility";
    case "AST":
      return "wb_sunny";
    case "ENG":
      return "mode_edit";
    case "BUS":
      return "cobusiness_centerde";
    case "ACC":
      return "account_balance";
    default:
      return "";
  }
};
//Icon colors below
export var iconColor = icon => {
  switch (icon) {
    case "CSC":
      return "#e56004";
    case "MTH":
      return "#1dadb8";
    case "COR":
      return "#650d0d";
    case "BIO":
      return "#29ba13";
    case "AST":
      return "#3d1cd0";
    case "ENG":
      return "#055d75";
    case "BUS":
      return "#0173d1";
    case "ACC":
      return "#02d14d";
    default:
      return "";
  }
};
