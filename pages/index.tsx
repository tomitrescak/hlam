import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { SplitPane } from "react-multi-split-pane";
import Editor from "@monaco-editor/react";
import { data } from "../data/data";
import { PlanSource } from "../components/PlanSource";
import { PlanInterpreter } from "../components/PlanInterpreter";
import { InterpretedScenario } from "../components/InterpretedScenario";

function debounce(func: any, timeout = 500) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, timeout);
  };
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hierarchic Language Abstractions Model</title>
        <meta name="description" content="Made for ICAPS 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeContent />
    </>
  );
};

const HomeContent: NextPage = () => {
  const [domain, setDomain] = React.useState(0);
  const [plan, setPlan] = React.useState(0);

  const [interpretation, setInterpretation] = React.useState<
    InterpretedScenario[] | null
  >(null);
  const [error, setError] = React.useState("Processing ...");

  React.useEffect(() => {
    setResult(undefined, undefined);
  }, []);

  function setResult(
    planSource: string | undefined,
    interpretation: string | undefined
  ) {
    try {
      setError("Processing ...");

      let p = new PlanSource(planSource || data[domain].plans[plan].result);
      let i = new PlanInterpreter(
        JSON.parse(interpretation || data[domain].interpretation)
      );

      let newInt = i.interpret(p);
      setInterpretation(newInt);
      setError("");
    } catch (ex) {
      setError((ex as Error).message);
    }
  }

  function handlePlanChange(value: string) {
    try {
      // here is the current value
      setResult(value, undefined);
    } catch (ex) {
      setError("Cannot process plan\n\n" + (ex as Error).message);
    }
  }

  function handleInterpretationChange(value: string) {
    try {
      // setError("Processing ...");
      // setProcessedInterpretation(new PlanInterpreter(JSON.parse(value)));
      // here is the current value
      setResult(undefined, value);
    } catch (ex) {
      setError("Cannot process interpretation\n\n" + (ex as Error).message);
    }
  }

  function show(what: string) {
    document.querySelector("#domain")!.style.display = "none";
    document.querySelector("#problem")!.style.display = "none";
    document.querySelector("#plan")!.style.display = "none";

    document.querySelector(`#${what}`)!.style.display = "";
  }

  return (
    <>
      <main>
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "1em",
            display: "flex",
          }}
        >
          {/* <div className="logo">
            <Image src="/wsu.png" width={150} height={63} alt="WSU Logo" />
          </div> */}
          <h1 style={{ color: "#efefef" }}>
            Hierarchic Language Abstraction Model Processor 1.0.1
          </h1>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 90,
            right: 0,
            bottom: 0,
          }}
        >
          <SplitPane split="vertical" minSize={50}>
            <div className="editor">
              <div className="editorHeader">
                <span style={{ flex: 1 }}>
                  <a href="#" onClick={() => show("domain")}>
                    Domain
                  </a>{" "}
                  &gt;{" "}
                  <a href="#" onClick={() => show("problem")}>
                    Problem
                  </a>{" "}
                  &gt;{" "}
                  <a href="#" onClick={() => show("plan")}>
                    Plan
                  </a>
                </span>
                <span style={{ fontSize: "smaller" }}>Preload →</span>
                <select
                  value={`${domain}-${plan}`}
                  onChange={(e) => {
                    let values = e.currentTarget.value.split("-");
                    let domain = parseInt(values[0]);
                    setDomain(domain);
                    let plan = parseInt(values[1]);
                    setPlan(plan);
                    setResult(
                      data[domain].plans[plan].result,
                      data[domain].interpretation
                    );
                  }}
                >
                  {data.flatMap((d, j) =>
                    d.plans.map((p, i) => (
                      <option key={`${d.id}-${i}`} value={`${j}-${i}`}>
                        {d.name} {i.toString().padStart(2, "0")}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div
                style={{
                  display: "none",
                  padding: 16,
                  marginTop: 30,
                  height: "100%",
                  overflow: "auto",
                }}
                id="domain"
              >
                <pre>{data[domain].domain}</pre>
              </div>
              <div
                style={{
                  display: "none",
                  padding: 16,
                  marginTop: 30,
                  height: "100%",
                  overflow: "auto",
                }}
                id="problem"
              >
                <pre>{data[domain].plans[plan].problem}</pre>
              </div>
              <div
                id="plan"
                style={{ width: "100%", height: "100%", marginTop: 40 }}
              >
                <Editor
                  defaultLanguage="text"
                  path={`plan-${domain}-${plan}.txt`}
                  defaultValue={data[domain].plans[plan].result}
                  onChange={debounce(handlePlanChange)}
                  theme="vs-dark"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                />
              </div>
            </div>
            <div className="editor">
              <div className="editorHeader">Interpretation</div>
              <Editor
                className="editor"
                onChange={debounce(handleInterpretationChange)}
                defaultValue={JSON.stringify(
                  JSON.parse(data[domain].interpretation),
                  null,
                  4
                )}
                defaultLanguage="json"
                theme="vs-dark"
              />
            </div>
            <div className="editor">
              <div className="editorHeader">Result</div>
              <section style={{ padding: 16 }}>
                {error && <div className="message">{error}</div>}
                {!error && interpretation && (
                  <div>
                    {interpretation.map((int, i) => (
                      <Scenario key={i} int={int} level={0} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </SplitPane>
        </div>
      </main>
    </>
  );
};

export const Scenario = ({
  int,
  level,
}: {
  int: InterpretedScenario;
  level: number;
}) => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <div>
      <div
        style={{ backgroundColor: `#4b8001${(255 - level * 60).toString(16)}` }}
        className="iHeader"
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ width: 20 }}>{expanded ? "-" : "+"}</div>
        {int.text}
      </div>
      {expanded && (int.scenarios.length || int.lines.length) && (
        <div className="iContent">
          {int.scenarios
            ? int.scenarios.map((sc, sci) => (
                <Scenario key={sci} int={sc} level={level + 1} />
              ))
            : null}
          {int.lines
            ? int.lines.map((sc, sci) => (
                <div key={sci}>
                  &middot;{" "}
                  <span style={{ color: "#adadad", fontWeight: 500 }}>
                    {sc.action}
                  </span>
                  &nbsp;&nbsp;
                  <span style={{ fontFamily: "monospace" }}>
                    {sc.parameters.join(" ")}
                  </span>
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default Home;
