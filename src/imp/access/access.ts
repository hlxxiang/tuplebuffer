import { AccessCPP } from "../../feature/access/access_cpp";
import { AccessCS } from "../../feature/access/access_cs";
import { AccessTS } from "../../feature/access/access_ts";
import { Access } from "../../gen/access";

Access.init(
    "Access",
    "\n" +
    "+----------+-----------+-----------+\n" +
    "          .数据库记录结构定义.         \n" +
    "+----------+-----------+-----------+\n",
    "Fields",
    "Native",
    [
        [DataType.Key, "Key"],
        [DataType.Hash, "Hash"],
        [DataType.List, "List"],
    ]
);

require("./access_declare");

Access.add(LangueType.CPP, AccessCPP);
Access.add(LangueType.CS, AccessCS);
Access.add(LangueType.TS, AccessTS);

Access.compile("./export", LangueType.CPP);
Access.compile("./export", LangueType.CS);
Access.compile("./export", LangueType.TS);