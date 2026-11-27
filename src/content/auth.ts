// 로그인·회원가입 화면 문구를 모아 둔 파일이에요. 여기 글자만 바꾸면 화면이 바뀌어요.

export const authPanel = {
  title: ["빛이 사라지는 속도로", "진짜를 가려요"],
  description: "로그인하면 인증 결과가 내 기록에 저장되고, 위조·재사용이 의심되면 바로 알려드려요.",
  points: ["별도 장비 없이 스마트폰만", "촬영 사진은 저장하지 않아요", "인증 기록을 한곳에서"],
};

export const loginText = {
  title: "로그인",
  description: "이메일과 비밀번호로 로그인하세요.",
  submit: "로그인",
  forgot: "비밀번호를 잊으셨나요?",
  noAccount: "아직 계정이 없나요?",
  signupLink: "회원가입",
};

export const signupText = {
  title: "회원가입",
  description: "이메일로 1분이면 가입할 수 있어요.",
  submit: "가입하기",
  agree: "이용약관과 개인정보처리방침에 동의해요. (필수)",
  hasAccount: "이미 계정이 있나요?",
  loginLink: "로그인",
  sentTitle: "인증 메일을 보냈어요",
  sentDescription: "메일함에서 인증 링크를 누르면 가입이 완료돼요. 메일이 안 보이면 스팸함도 확인해 주세요.",
};

export const resetText = {
  title: "비밀번호 찾기",
  description: "가입한 이메일을 입력하면 비밀번호를 다시 설정하는 링크를 보내드려요.",
  submit: "재설정 링크 받기",
  sentTitle: "메일을 보냈어요",
  sentDescription: "메일함에서 링크를 눌러 새 비밀번호를 설정해 주세요.",
  back: "로그인으로 돌아가기",
};

export const updatePasswordText = {
  title: "새 비밀번호 설정",
  description: "영문과 숫자를 포함해 8자 이상으로 정해 주세요.",
  submit: "비밀번호 변경",
};
