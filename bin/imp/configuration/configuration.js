"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_cpp_1 = require("../../feature/configuration/configuration_cpp");
const configuration_cs_1 = require("../../feature/configuration/configuration_cs");
const configuration_ts_1 = require("../../feature/configuration/configuration_ts");
const configuration_1 = require("../../gen/configuration");
configuration_1.Configuration.init("Configuration", "Fields", "配置", "demo/config/excel", "src/", "demo/server/publish/configs", "demo/client/Assets/StreamingAssets/Configs", "demo/client/Assets", "demo/client/Assets/Editor Default Resources/Configs");
require("./configuration_declare");
configuration_1.Configuration.add(1, configuration_cpp_1.ConfigurationCPP);
configuration_1.Configuration.add(2, configuration_cs_1.ConfigurationCS);
configuration_1.Configuration.add(3, configuration_ts_1.ConfigurationTS);
configuration_1.Configuration.compile("./export", 1);
configuration_1.Configuration.compile("./export", 2);
configuration_1.Configuration.compile("./export", 3);
//# sourceMappingURL=configuration.js.map