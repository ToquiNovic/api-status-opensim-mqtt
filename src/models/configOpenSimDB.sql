CREATE TABLE team_seminario (
    id_team INT NOT NULL,
    name_team VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_team)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE team_usuario (
    id_team INT,
    id_usuario CHAR(36),
    state_team VARCHAR(255),
    FOREIGN KEY (id_team) REFERENCES team_seminario(id_team),
    FOREIGN KEY (id_usuario) REFERENCES useraccounts(PrincipalID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE iot (
    id_sensor INT NOT NULL,
    name_sensor VARCHAR(255) NOT NULL,
    value_data VARCHAR(255) NOT NULL,
    fk_team INT NOT NULL,
    PRIMARY KEY (id_sensor)
    FOREIGN KEY (fk_team) REFERENCES team_seminario(id_team)
);

CREATE TABLE `useraccounts` (
  `PrincipalID` char(36) NOT NULL,
  `ScopeID` char(36) NOT NULL,
  `FirstName` varchar(64) NOT NULL,
  `LastName` varchar(64) NOT NULL,
  `Email` varchar(64) DEFAULT NULL,
  `ServiceURLs` text DEFAULT NULL,
  `Created` int(11) DEFAULT NULL,
  `UserLevel` int(11) NOT NULL DEFAULT 0,
  `UserFlags` int(11) NOT NULL DEFAULT 0,
  `UserTitle` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `active` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

