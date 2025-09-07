import React, { useContext } from "react";
import AppContent from "../context/AppContext.jsx";

function ConfigPreset({ configPreset, setConfigPreset }) {
    const {showCfg} = useContext(AppContent);
    const updatePresetResult = (path, value) => {
        setConfigPreset(prev => {
            const copy = structuredClone(prev);
            let obj = copy;
            for (let i = 0; i < path.length - 1; i++) {
                obj = obj[path[i]];
            }
            obj[path[path.length - 1]].result = value;
            return copy;
        });
    };

    const renderConfigPreset = (obj, path = []) => {
        if(!showCfg){
            return Object.entries(obj).map(([key, value]) => {
            const newPath = [...path, key];

            if (value && typeof value === "object" && "result" in value) {
                if("choose" in value){
                    return (
                    <div key={newPath.join("-")} className="config-property">
                        <label>{key}</label>
                        <select
                            value={value.result}
                            onChange={(e) => updatePresetResult(newPath, e.target.value)}
                        >
                            <option value="">Select...</option>
                            {value.choose.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                );
                }
                else{
                    return (
                        <div key={newPath.join("-")} className="config-property">
                            <label>{key}</label>
                            <input
                                type="text"
                                placeholder='Enter value...'
                                value={value.result}
                                onChange={(e) => updatePresetResult(newPath, e.target.value)}
                            />
                        </div>
                    );
                }
            } else if (value && typeof value === "object") {
                const isSubmenu = path.length > 0;
                return (
                    <div
                        key={newPath.join("-")}
                        className={isSubmenu ? "config-submenu" : "config-menu"}
                    >
                        <h3>{key.toUpperCase()}</h3>
                        {renderConfigPreset(value, newPath)}
                    </div>
                );
            } else {
                return null;
            }
        });
        }
        else{
            return Object.entries(obj).map(([key, value]) => {
            const newPath = [...path, key];

            if (value && typeof value === "object" && "result" in value) {
                return (
                    <div key={newPath.join("-")} className="config-property">
                        <label>{key}</label>
                        <h4 style={{marginLeft: "10px", color: "#FFD700"}}>
                            {value.result !== "" ? value.result : <span style={{color: "#888"}}>No value</span>}
                        </h4>
                    </div>
                );
            } else if (value && typeof value === "object") {
                const isSubmenu = path.length > 0;
                return (
                    <div
                        key={newPath.join("-")}
                        className={isSubmenu ? "config-submenu" : "config-menu"}
                    >
                        <h3>{key.toUpperCase()}</h3>
                        {renderConfigPreset(value, newPath)}
                    </div>
                );
            } else {
                return null;
            }
        });
        }
    };

    return <>{renderConfigPreset(configPreset)}</>;
}

export default ConfigPreset;