// 입력값 검사 규칙. 문제가 있으면 오류 문구를, 없으면 undefined 를 돌려줘요.

export const checkEmail = (v: string) =>
  !v.trim() ? "이메일을 입력해 주세요." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "올바른 이메일 형식이 아니에요." : undefined;

export const checkPassword = (v: string) => (!v ? "비밀번호를 입력해 주세요." : undefined);

export const checkNewPassword = (v: string) =>
  !v ? "비밀번호를 입력해 주세요." : !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v) ? "영문과 숫자를 포함해 8자 이상 입력해 주세요." : undefined;

export const checkConfirm = (pw: string, v: string) =>
  !v ? "비밀번호를 한 번 더 입력해 주세요." : pw !== v ? "비밀번호가 서로 달라요." : undefined;

export const checkName = (v: string) => (!v.trim() ? "이름을 입력해 주세요." : undefined);

/** 오류가 하나라도 있는지 */
export const hasError = (errors: Record<string, string | undefined>) => Object.values(errors).some(Boolean);
