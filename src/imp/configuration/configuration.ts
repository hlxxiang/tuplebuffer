import { ConfigurationCPP } from "../../feature/configuration/configuration_cpp";
import { ConfigurationCS } from "../../feature/configuration/configuration_cs";
import { ConfigurationTS } from "../../feature/configuration/configuration_ts";
import { Configuration } from "../../gen/configuration";

Configuration.init(
    "Configuration",
    "配置",
    "IConfiguration",
    "Fields",
    "demo/config/excel",
    "src/",
    "demo/server/publish/configs",
    "demo/client/Assets/StreamingAssets/Configs",
    "demo/client/Assets",
    "demo/client/Assets/Editor Default Resources/Configs",
);

require("./configuration_declare");

Configuration.add(LangueType.CS, ConfigurationCS);
// Configuration.add(LangueType.CPP, ConfigurationCPP);
// Configuration.add(LangueType.TS, ConfigurationTS);

Configuration.compile("./export", LangueType.CS);
// Configuration.compile("./export", LangueType.CPP);
// Configuration.compile("./export", LangueType.TS);