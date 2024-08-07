import { EnumCPP } from "../../feature/enum/enum_cpp";
import { EnumCS } from "../../feature/enum/enum_cs";
import { EnumTS } from "../../feature/enum/enum_ts";
import { Enum } from "../../gen/enum";

Enum.init(
    "Enum",
    "枚举",
)

require("./enum_util");

Enum.add(LangueType.CS, EnumCS);

Enum.add(LangueType.CPP, EnumCPP);
Enum.add(LangueType.TS, EnumTS);

Enum.compile("./export", LangueType.CS);
Enum.compile("./export", LangueType.CPP);
Enum.compile("./export", LangueType.TS);