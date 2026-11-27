// 스캔(정품 확인) 화면 문구를 모아 둔 파일이에요.

export const scanText = {
  title: "정품 확인",
  guide: "스티커를 사각형 안에 맞춰 주세요",
  charging: "플래시로 빛을 충전하고 있어요",
  capturing: "잔광을 연속으로 촬영하고 있어요",
  analyzing: "감쇠 패턴을 대조하고 있어요",
  holdStill: "폰을 움직이지 말고 잠시만 기다려 주세요",
  noCamera: "카메라 권한을 허용해 주세요",
  noTorch: "이 기기에서는 플래시를 켤 수 없어요. 밝은 빛을 쬔 스티커를 어두운 곳에서 촬영해 주세요",
  privacy: "촬영한 사진은 판별 직후 지워져요",
};

// 판정 결과별 문구
export const outcomeText = {
  genuine: { badge: "정품", title: "정품으로 확인됐어요", desc: "등록된 원본과 잔광 패턴이 일치해요." },
  fake: { badge: "위조 의심", title: "원본과 패턴이 달라요", desc: "등록된 어떤 스티커와도 감쇠 패턴이 맞지 않아요. 구매처나 공급처에 확인해 주세요." },
  unverified: { badge: "확인 불가", title: "패턴을 읽지 못했어요", desc: "비즈가 충분히 보이지 않았어요. 어두운 곳에서 스티커 전체가 사각형에 들어오게 다시 촬영해 주세요." },
};
