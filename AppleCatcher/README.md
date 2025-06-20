# 사과게임 (Apple Game)

2분 안에 합이 10이 되는 사과들을 드래그해서 최고 점수를 획득하는 퍼즐 게임입니다.

## 주요 기능

- 17x10 격자의 사과 게임판
- 드래그로 사과 선택 (합이 10이 되는 조합)
- 2분 제한시간
- 힌트 시스템 (3회 제공)
- 실시간 랭킹 시스템 (일간/주간/월간/전체)
- 점수 등록 및 리더보드

## 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- PostgreSQL 데이터베이스

### 1. 프로젝트 설치
```bash
# 의존성 설치
npm install

# 데이터베이스 설정
npm run db:push
```

### 2. 환경변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/apple_game
```

### 3. 실행
```bash
# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5000`으로 접속하세요.

## 게임 방법

1. **시작**: "Start Game" 버튼을 클릭
2. **선택**: 마우스로 드래그해서 사과들을 선택
3. **조합**: 선택한 사과들의 합이 정확히 10이 되어야 함
4. **힌트**: 💡 힌트 버튼으로 가능한 조합을 확인 (3회 제한)
5. **점수**: 성공할 때마다 사과 개수만큼 점수 획득
6. **랭킹**: 게임 종료 후 점수를 등록해서 랭킹에 도전

## 기술 스택

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build**: Vite

## 프로젝트 구조

```
├── client/           # 프론트엔드 코드
│   ├── src/
│   │   ├── components/   # React 컴포넌트
│   │   ├── lib/         # 유틸리티 및 상태관리
│   │   └── pages/       # 페이지 컴포넌트
├── server/           # 백엔드 코드
│   ├── index.ts     # 서버 엔트리포인트
│   └── routes.ts    # API 라우트
├── shared/          # 공통 스키마
└── package.json     # 프로젝트 설정
```

## 배포

프로덕션 배포 시:

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 라이선스

MIT License