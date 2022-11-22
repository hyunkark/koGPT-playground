import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";

type postBodyType = {
  prompt: string;
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  n?: number;
};

function App() {
  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [temp, setTemp] = useState(0);
  const [topP, setTopP] = useState(0);
  const [resultNum, setResultNum] = useState(1);
  const [isShown, setIsShown] = useState({
    isTemp: "false",
    istopP: "false",
    isResult: "false",
  });
  const [result, setResult] = useState([{ text: "", tokens: 0 }]);
  const [processing, setProcessing] = useState(false);

  const url =
    "http://cors-anywhere.herokuapp.com/https://api.kakaobrain.com/v1/inference/kogpt/generation";

  const postBody: postBodyType = {
    prompt: token,
    max_tokens: 120,
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setToken(event.currentTarget.value);
  };

  const handleApi = (event: React.FormEvent<HTMLInputElement>) => {
    setApiKey(event.currentTarget.value);
  };

  const handleSubmit = () => {
    setProcessing(true);
    if (isShown.isTemp === "true") {
      postBody.temperature = temp / 100;
    }
    if (isShown.istopP === "true") {
      postBody.top_p = topP / 100;
    }
    if (isShown.isResult === "true") {
      postBody.n = resultNum;
    }

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setResult(data.generations);
        setProcessing(false);
      })
      .catch((error) => {
        alert(error);
        setProcessing(false);
      });
  };

  const handleCopy = (text: string) => {
    window.navigator.clipboard.writeText(text).then(() => alert("복사 완료!"));
  };

  return (
    <>
      <GlobalStyle />
      <MainWrap>
        <Title>KoGPT Playground</Title>
        <div>
          <details>
            <Summary>Before you start</Summary>
            <div>
              <ol>
                <li>
                  <a href="https://cors-anywhere.herokuapp.com/corsdemo">
                    이 페이지
                  </a>
                  에 들어가서 'Reuqest temporary access to the demo server'
                  버튼을 눌러주세요.
                </li>
                <li>
                  현재 페이지의 주소창 왼쪽의 자물쇠 아이콘을 눌러, 맨 밑의
                  사이트 설정에 들어가세요. 사이트 설정에서 밑 쪽에 안전하지
                  않은 콘텐츠를 '허용' 으로 바꿔주세요.
                </li>
              </ol>
            </div>
          </details>
        </div>
        <Main>
          <InputWrap>
            <h2>Input</h2>

            <IndicatorWrap>
              <p>* 표시가 있는 부분은 필수항목입니다</p>
              <TweakWrap>
                <Label htmlFor="apiKey">*REST Api key</Label>
                <Input
                  type="text"
                  name="apiKey"
                  id="apiKey"
                  value={apiKey}
                  onChange={handleApi}
                  autoComplete="true"
                  required
                ></Input>
              </TweakWrap>
              <TweakWrap>
                <Label htmlFor="max-token">*결과 문장 길이</Label>
                <Input type="number" name="max-token" id="max-token"></Input>
              </TweakWrap>
              <TweakWrap toggle>
                <label>temperature</label>
                <input
                  type="checkbox"
                  value={isShown.isTemp.toString()}
                  onChange={(event) => {
                    const value =
                      event.target.value === "true" ? "false" : "true";
                    setIsShown({ ...isShown, isTemp: value });
                  }}
                ></input>
                <label>top_p</label>
                <input
                  type="checkbox"
                  value={isShown.istopP.toString()}
                  onChange={(event) => {
                    const value =
                      event.target.value === "true" ? "false" : "true";
                    setIsShown({ ...isShown, istopP: value });
                  }}
                ></input>
                <label>results</label>
                <input
                  type="checkbox"
                  value={isShown.isResult.toString()}
                  onChange={(event) => {
                    const value =
                      event.target.value === "true" ? "false" : "true";
                    setIsShown({ ...isShown, isResult: value });
                  }}
                ></input>
              </TweakWrap>
              {isShown.isTemp === "true" && (
                <>
                  <TweakWrap>
                    <Label htmlFor="temperature">temperature</Label>
                    {temp / 100}
                    <Input
                      type="range"
                      name="temperature"
                      id="temperature"
                      min="10"
                      max="100"
                      step="10"
                      value={temp}
                      onChange={(event) => setTemp(Number(event.target.value))}
                    ></Input>
                  </TweakWrap>
                  <Caption>
                    온도 설정 : 0 초과 1 이하의 실수 값 사용 가능. 수치가
                    높을수록 더 창의적인 결과가 생성됨
                  </Caption>
                </>
              )}
              {isShown.istopP === "true" && (
                <>
                  <TweakWrap>
                    <Label htmlFor="top-p">top_p</Label>
                    {topP / 100}
                    <Input
                      type="range"
                      name="top-p"
                      id="top-p"
                      min="0"
                      max="100"
                      step="10"
                      value={topP}
                      onChange={(event) => setTopP(Number(event.target.value))}
                    ></Input>
                  </TweakWrap>
                  <Caption>
                    상위 확률 설정: 0 이상 1 이하의 실수 값 사용 가능. 수치가
                    높을수록 더 창의적인 결과가 생성됨
                  </Caption>
                </>
              )}
              {isShown.isResult === "true" && (
                <>
                  <TweakWrap>
                    <Label htmlFor="results">results</Label>
                    {resultNum}
                    <Input
                      type="range"
                      name="results"
                      id="results"
                      max="16"
                      min="1"
                      value={resultNum}
                      onChange={(event) =>
                        setResultNum(Number(event.target.value))
                      }
                    ></Input>
                  </TweakWrap>
                  <Caption>
                    results: KoGPT가 생성할 결과 수. 설정값 만큼 요청을 처리하고
                    쿼터를 차감함
                  </Caption>
                </>
              )}
            </IndicatorWrap>
            <Label htmlFor="token" textArea>
              *AI로 바꿀 텍스트
            </Label>
            <TextInput
              name="token"
              id="token"
              placeholder="여기에 한국어 텍스트를 입력하세요"
              value={token}
              onChange={handleInput}
            ></TextInput>
            <ButtonContainer>
              <SubmitButton
                type="submit"
                onClick={handleSubmit}
                disabled={!token || !apiKey || processing}
              >
                submit
              </SubmitButton>
            </ButtonContainer>
          </InputWrap>
          <ResultWrap>
            <div>
              <h2>Result</h2>
              <Result>
                {processing ? (
                  <Loader>
                    <img
                      src="https://media.giphy.com/media/131tNuGktpXGhy/giphy.gif"
                      alt="an gif of hourglass that indicates the result is loading"
                    />
                  </Loader>
                ) : (
                  <>
                    {result[0].text.length > 0 &&
                      result.map((item, idx) => (
                        <ResultCard key={idx.toString()}>
                          <ResultTitle>{idx + 1}번째 결과</ResultTitle>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.text }}
                          ></div>
                          <ButtonContainer>
                            <SubmitButton
                              type="button"
                              onClick={() => handleCopy(item.text)}
                            >
                              copy
                            </SubmitButton>
                          </ButtonContainer>
                        </ResultCard>
                      ))}
                  </>
                )}
              </Result>
            </div>
          </ResultWrap>
        </Main>
      </MainWrap>
    </>
  );
}

const MainWrap = styled.div`
  width: 1210px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: space-between;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #0f62fe;
  padding-bottom: 8px;
  border-bottom: 2px solid #0f62fe;
`;

const Summary = styled.summary`
  font-size: 22px;
  font-weight: bold;
  padding: 8px;
  border-radius: 8px;
  background-color: #edf5ff;
  cursor: pointer;
`;

const Main = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const IndicatorWrap = styled.div`
  margin-bottom: 20px;
  background-color: rgb(240, 248, 255);
  border-radius: 8px;
  padding: 20px;
`;

const Caption = styled.div`
  font-size: 12px;
  text-align: end;
  margin-right: 32px;
  margin-top: 8px;
`;

const TweakWrap = styled.div<{ toggle?: boolean }>`
  padding: 2px 0;
  display: flex;
  ${({ toggle }) =>
    toggle && "justify-content: flex-end; margin-right: 32px; margin-top: 8px;"}
  align-items: center;
`;

const Label = styled.label<{ textArea?: boolean }>`
  display: inline-block;
  width: 30%;
  ${({ textArea }) =>
    textArea ? "text-align: start; margin-bottom: 8px;" : "text-align: end;"}
  margin-right: 24px;
`;

const Input = styled.input`
  width: 60%;
  padding: 8px;
`;

const InputWrap = styled.div`
  width: 48%;
`;

const ResultWrap = styled.div`
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TextInput = styled.textarea`
  border: 1px solid #0f62fe;
  width: 100%;
  height: 300px;
  padding: 24px;
  font-size: 16px;
  font-family: "Mona Sans", sans-serif;
  overflow: auto;
  outline: none;
  resize: none;
  border-radius: 8px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const SubmitButton = styled.button`
  background-color: #0f62fe;
  color: #fff;
  font-size: 16px;
  border: none;
  font-family: "Mona Sans", sans-serif;
  border-radius: 8px;
  padding: 12px 24px;
  overflow: visible;
  cursor: pointer;

  &:disabled {
    color: black;
    background-color: lightgray;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  width: 100%;
`;

const ResultCard = styled.div`
  border: 1px solid #0f62fe;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const ResultTitle = styled.div`
  color: #0f62fe;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Loader = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 120px;
`;

export default App;
