# Software Requirements Specification (SRS) (& System testing)

## Project title

The Turing Test

## Project description

본 프로젝트는 "죽은 인터넷 이론"에 영감을 받아 AI만을 이용하여 소통하는 온라인 커뮤니티를 기술적으로 구현해보는 프로젝트입니다.<br> 처음 방문자는 AI의 이름으로만 가득 찬 흑백의 '죽은 인터넷'을 마주하게 됩니다. 하지만 '인간'임을 증명하고 로그인하는 순간, 세상은 다채로운 색으로 변하고 글 뒤에 숨어있던 진짜 작성자인 당신의 닉네임이 드러납니다.<br> 이 극적인 반전을 통해 AI가 만든 결과물 속 진짜 영혼은 결국 인간의 '의도'임을 보여주며, 커뮤니티 자체가 하나의 거대한 튜링 테스트가 되는 경험을 선사합니다.<br> 게시판에 작성되는 모든 게시글과 댓글은 AI에 의해서만 작성됩니다. 사용자가 작성할 수 있는 것은 오직 프롬프트입니다. 사용자는 프롬프트를 작성하기 위해 캡챠등의 기술을 통해 자신이 로봇이 아님을 증명해야 합니다.

## Team members
| (Student ID) | (Name) |
| --- | --- |
| 22212017 | 김은강 |
| 21912130 | 김정우 |
| 22211996 | 박종선 |
| 22313549 | 강승훈 |
| 22012146 | 허태규 |

## 1. 요구사항 정의 (Requirements description)

| ID | "업무명 (기능) (Function name)" | "요약 (Summary of the function)" | "세부요구사항 설명 (서술식) (predicative summary of the function)" | "입력변수 (Input variables to test the function)" | "정상 입력값 partitioning (Normal inputs partitioning)" | "예외 입력값 partitioning (Exceptional inputs partitioning)" | "추적성 (Traceability)" | "우선순위 (Priority) (High, Medium, Low)" | "테스트 결과 (Test result)" |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 회원가입 |  |  | - | - | - |  |  |  |
| 1.1 |  | 사용자가 새 계정을 생성하는 기능 |  | - | - | - |  |  |  |
| 1.1.1 |  |  | 사용자는 닉네임, 비밀번호를 필수로 입력 해야한다. | 닉네임, 비밀번호 | - 두 필드 모두 공백/NULL 아님<br>- 닉네임: 비어 있지 않은 문자열<br>- 비밀번호: 비어 있지 않은 문자열 | - 비밀번호만 공백/NULL 또는 규칙 위반<br>- 닉네임만 공백/NULL 또는 길이/문자 규칙 위반<br>- 두 필드 모두 공백/NULL |  | High | Pass |
| 1.1.2 |  |  | 시스템은 비밀번호 규칙에 따라 비밀번호의 유효성을 검사해야한다. | 비밀번호 | - 비밀번호 규칙(최소/최대 길이, 필수 문자조합, 허용 문자 등)을 모두 만족하는 문자열 | - 최소 길이 미만 또는 최대 길이 초과<br>- 필수 문자(숫자/영문/특수문자 등) 누락<br>- 허용되지 않은 문자(공백, 제어문자 등) 포함<br>- 공백/NULL 비밀번호 |  | Low | Fail |
| 1.1.3 |  |  | 시스템은 CAPTCHA를 통해 사용자가 사람인지 확인해야한다. | CAPTCHA 응답 값(captcha_token), CAPTCHA 유효시간(expire_time), 서버 검증 결과 | - captcha_token이 서버 정답과 일치<br>- CAPTCHA 유효시간 내 제출 | - captcha_token 오답<br>- captcha_token 공백/NULL<br>- CAPTCHA 유효시간 만료 후 제출<br>- 토큰 형식 오류 또는 검증 서버 오류 |  | High | Pass |
| 1.1.4 |  |  | 회원가입 성공시 로그인화면으로 이동해야한다. | 회원가입 처리 결과(registration_result), 리다이렉트 대상 화면(redirect_target) | - registration_result = 성공<br>- redirect_target ∈ {로그인 화면} | - registration_result = 실패인데 로그인 화면으로 이동<br>- registration_result = 성공인데 정의되지 않은 화면으로 이동<br>- redirect_target NULL/알 수 없는 값 | 4 | High | Pass |
| 1.1.5 |  |  | 비밀번호는 단방향 암호화를 통해 암호화해 저장해야한다. | 원문 비밀번호(raw_password), 암호화 함수(hash_function), 저장된 비밀번호 해시값 | - raw_password가 공백이 아니고 규칙을 만족<br>- hash_function 호출 성공<br>- 저장된 값이 raw_password와 다른 해시 문자열 | - raw_password 공백/NULL<br>- 지나치게 긴 raw_password로 암호화 실패<br>- hash_function 실행 오류 또는 NULL 반환<br>- 해시 결과 없이 평문 비밀번호가 저장되는 경우 | 2.1.2, 4.1.1, 4.1.2 | High | Pass |
| 2 | 로그인 |  |  | - | - | - |  |  |  |
| 2.1 |  | 사용자가 회원가입을 통해 만든 계정으로 접속하는 기능 |  | - | - | - |  |  |  |
| 2.1.1 |  |  | 사용자는 닉네임, 비밀번호를 필수로 입력해야한다. | 닉네임, 비밀번호 | - 닉네임: 공백/NULL 아님<br>- 비밀번호: 공백/NULL 아님 | - 닉네임 공백/NULL <br>- 비밀번호 공백/NULL<br>- 둘 다 공백/NULL |  | High | Pass |
| 2.1.2 |  |  | 시스템은 닉네임의 존재 여부와 비밀번호의 일치 여부를 확인해야한다. | 비밀번호, 해당 닉네임 존재 여부, 저장된 비밀번호 해시 | - 존재하는 닉네임이며, 입력 비밀번호가 저장된 해시와 일치함 | - 존재하지 않는 닉네임<br>- 닉네임은 존재하지만 비밀번호 불일치<br>- 닉네임/비밀번호 공백 | 1.1.7 | High | Pass |
| 2.1.3 |  |  | 시스템은 로그인 실패 후 재시도시 CAPTCHA를 통해 사람인지 확인해야한다. | 로그인 실패 횟수(login_fail_count), 이메일, 비밀번호, CAPTCHA 응답 값(captcha_token) | - login_fail_count가 임계값 이하 → CAPTCHA 없이 재시도 가능<br>- login_fail_count가 임계값 초과 AND 올바른 captcha_token 제출 | - login_fail_count 임계값 초과인데 captcha_token 공백/NULL<br>- login_fail_count 임계값 초과인데 captcha_token 오답<br>- login_fail_count 값이 음수/비정상 |  | High | Pass |
| 2.1.4 |  |  | 로그인 성공시 메인 화면으로 이동해야 함 | 로그인 결과(login_result), 리다이렉트 대상 화면(redirect_target) | - login_result = 성공<br>- redirect_target = 메인 화면 | - login_result = 실패인데 메인 화면으로 이동<br>- login_result = 성공인데 다른 화면으로 이동<br>- redirect_target NULL/알 수 없는 값 |  | High | Pass |
| 2.1.5 |  |  | 시스템은 로그인 성공시 사용자에게 세션 또는 토큰을 부여해야한다. | 로그인 결과(login_result), 세션 ID(session_id) 또는 토큰(token) | - login_result = 성공<br>- 유효한 session_id 또는 token이 생성됨(공백/NULL 아님) | - login_result = 성공인데 session_id/token이 NULL 또는 빈 문자열<br>- 중복된 session_id/token 생성<br>- login_result = 실패인데 세션/토큰이 생성됨 | 3.1.1 | High | Pass |
| 2.1.6 |  |  | 시스템은 사용자의 로그인 시도시 로그인 시간등을 포함하여 로그를 저장해야 한다. | 로그인 시각(login_time) | - login_time: 유효한 날짜/시간 값 | - login_time NULL 또는 파싱 불가 형식 | 4.1.5, 4.1.6 | Medium | Pass |
| 3 | 로그아웃 |  |  | - | - | - |  |  |  |
| 3.1 |  | 사용자가 세션을 종료하는 기능 |  | - | - | - |  |  |  |
| 3.1.1 |  |  | 시스템은 사용자가 로그아웃을 수행하면 즉시 세션을 무효화 해야한다. | 현재 세션 ID(session_id), 로그아웃 요청 여부(logout_request) | - 유효한 session_id가 존재<br>- logout_request가 정상적으로 발생 | - session_id NULL 또는 이미 만료된 세션에 대한 로그아웃 요청<br>- 변조된/유효하지 않은 session_id | 2.1.6 | High | Pass |
| 3.1.2 |  |  | 로그아웃 후 메인 화면으로 이동해야 한다. | 로그아웃 처리 결과(logout_result), 리다이렉트 대상 화면(redirect_target) | - logout_result = 성공<br>- redirect_target = 메인 화면 | - logout_result = 실패인데 메인 화면으로 이동<br>- logout_result = 성공인데 다른 화면으로 이동<br>- redirect_target NULL/알 수 없는 값 |  | High | Pass |
| 4 | 내 정보 관리 |  |  | - | - | - |  |  |  |
| 4.1 |  | 사용자가 자신의 계정이나 작성글/댓글을 관리할 수 있는 기능 |  | - | - | - |  |  |  |
| 4.1.1 |  |  | 사용자는 비밀번호, 닉네임을 변경할 수 있어야 한다. | 새 비밀번호(new_password), 새 닉네임(new_nickname) | - new_password: 비어 있지 않은 문자열(비어있을시 기존 동일) <br>- new_nickname: 비어 있지 않은 문자열 | - new_password : NULL<br>- new_nickname : 공백/NULL | 1.1.7 | High | Pass |
| 4.1.2 |  |  | 사용자는 비밀번호 변경하려면 현재 비밀번호를 입력 해야한다. | 현재 비밀번호(cur_password) | - cur_password: 현재 비밀번호와 같은 문자열 | - cur_password: 현재 비밀번호와 같지않은 문자열 또는 NULL | 1.1.8 | High | Pass |
| 4.1.3 |  |  | 사용자는 최근 로그인 이력을 조회할 수 있어야 한다. | 사용자 ID(user_id), 조회 기간(from_date, to_date) 또는 페이지(page) | - user_id가 현재 로그인 사용자와 일치<br>- from_date ≤ to_date<br>- page ≥ 1 | - user_id가 다른 사용자의 ID(타인 이력 조회 시도)<br>- from_date > to_date<br>- page ≤ 0 또는 비정상 값 | 2.1.7, 4.1.6 | Medium | Pass |
| 4.1.4 |  |  | 로그인 이력에는 로그인 시간이 표시되어야 한다. | 로그인 이력 항목(time) | - time: 유효한 날짜/시간 | - time이 NULL 또는 파싱 불가 | 2.1.7, 4.1.5 | Medium | Pass |
| 4.1.5 |  |  | 사용자는 본인이 작성한 글과 댓글을 조회할 수 있어야 한다. | 사용자 ID(user_id), 페이지(page), 페이지 크기(size) | - user_id가 현재 로그인 사용자와 일치<br>- page ≥ 1, size ≥ 1 | - user_id가 타인 또는 NULL<br>- page ≤ 0 또는 size ≤ 0<br>- 존재하지 않는 user_id |  | High | Pass |
| 4.1.6 |  |  | 사용자는 회원 탈퇴를 요청할 수 있어야 한다. | 탈퇴 요청 여부(withdraw_request), 탈퇴 재확인 입력(확인 체크/문구 입력) | - withdraw_request = true<br>- 탈퇴 재확인 입력이 요구 형식을 만족 | - withdraw_request = false<br>- 재확인 문구 오입력 또는 미입력<br>- 인증되지 않은 사용자의 탈퇴 요청 |  | High | Pass |
| 4.1.7 |  |  | 시스템은 회원탈퇴 요청을 받으면 계정을 삭제 해야 한다. | 탈퇴 요청 여부(withdraw_request) | - withdraw_request = false → 계정 활성 유지<br>- withdraw_request = true → 계정 삭제 대상 | - withdraw_request가 true/false가 아닌 값 |  | High | Pass |
| 5 | 게시글 생성 |  |  | - | - | - |  |  |  |
| 5.1 |  | 사용자가 새로운 게시글을 작성하는 기능 |  | - | - | - |  |  |  |
| 5.1.1 |  |  | 사용자는 제목과 내용을 필수로 입력해야 하며, 세부 키워드나 설명을 추가할 수 있다. | 제목(title), 내용(content 또는 프롬프트), 세부 키워드(detail_keywords), 설명(description) | - 제목과 내용이 모두 공백/NULL 아님<br>- 제목과 내용이 허용 길이/문자 집합을 만족<br>- 세부 키워드와 설명은 비워두거나 허용 형식을 만족 | - 제목 또는 내용이 공백/NULL<br>- 제목/내용 길이가 최대 허용치를 초과<br>- 허용되지 않은 문자를 포함하는 제목/내용/키워드/설명 |  | High | Pass |
| 5.1.2 |  |  | 작성자는 로그인 정보 기반으로 자동 등록되어야한다. | 로그인 사용자 세션(session), 로그인 사용자 ID(user_id), 게시글 작성자 필드(author_id) | - 유효한 세션이 존재<br>- author_id = 현재 로그인 user_id | - 세션 없음 또는 만료된 세션<br>- author_id와 로그인 user_id 불일치<br>- 비로그인 사용자가 게시글 작성 시도 |  | High | Pass |
| 5.1.3 |  |  | AI는 사용자가 입력한 프롬프트를 바탕으로 게시글 본문을 자동 작성한다. | 사용자 프롬프트(prompt_text), AI 모델 상태(model_status), AI 응답 내용(ai_content) | - prompt_text가 1자 이상이며 허용 길이/문자 집합 만족<br>- AI 호출 성공, ai_content 생성됨 | - prompt_text 공백/NULL<br>- prompt_text가 허용 길이 초과<br>- AI 호출 실패 또는 타임아웃<br>- ai_content가 NULL/공백 |  | High | Pass |
| 5.1.4 |  |  | 게시글 작성 시 작성일자 및 수정일자, 작성자 등이 자동 기록되어야 한다. | 서버 현재 시간(server_time), 작성자 ID(author_id), 게시글 ID(post_id), 생성/수정일자(created_at, updated_at) | - post_id가 정상 생성<br>- created_at, updated_at이 server_time 기준 유효한 날짜/시간<br>- created_at ≤ updated_at<br>- author_id가 비로그인 사용자가 아님 | - created_at 또는 updated_at NULL/파싱 불가<br>- updated_at < created_at<br>- author_id NULL 또는 존재하지 않는 사용자 |  | High | Pass |
| 5.1.5 |  |  | 작성 후 사용자는 게시글 목록이나 게시글 상세 페이지로 자동 이동한다. | 게시글 생성 결과(create_result), 리다이렉트 대상(redirect_target) | - create_result = 성공<br>- redirect_target ∈ {게시글 목록 페이지, 게시글 상세 페이지} | - create_result = 실패인데 목록/상세 페이지로 이동<br>- create_result = 성공인데 정의되지 않은 페이지로 이동<br>- redirect_target NULL/알 수 없는 값 | 5.1.1, 5.1.2, 5.1.4 | Medium | Pass |
| 6 | 게시글 수정 |  |  | - | - | - |  |  |  |
| 6.1 |  | 작성자가 기존 게시글을 수정하는 기능 |  | - | - | - |  |  |  |
| 6.1.1 |  |  | 게시글 수정은 작성자 본인만 가능하다. | 로그인 사용자 ID(current_user_id), 게시글 작성자 ID(author_id) | - current_user_id = author_id | - current_user_id ≠ author_id<br>- 비로그인 사용자가 수정 시도 |  | High | Pass |
| 6.1.2 |  |  | 사용자는 "어떤 부분을 수정할지"를 프롬프트로 입력하고, AI가 해당 지시에 맞게 게시글을 자동 수정한다. | 수정 프롬프트(edit_prompt), 기존 게시글 내용(original_content), AI 모델 상태, 수정된 내용(edited_content) | - edit_prompt 1자 이상, 허용 길이/문자 집합 만족<br>- original_content가 존재<br>- AI 호출 성공, edited_content 생성 | - edit_prompt 공백/NULL<br>- edit_prompt 길이 초과<br>- 대상 게시글이 존재하지 않음<br>- AI 호출 실패 또는 응답 없음 |  | High | Pass |
| 6.1.3 |  |  | 수정완료시 수정 일자가 자동으로 업데이트되어야 한다. | 기존 수정일자(prev_updated_at), 새로운 수정일자(new_updated_at), 수정 결과(edit_result) | - edit_result = 성공<br>- new_updated_at이 유효한 날짜/시간<br>- prev_updated_at가 존재하는 경우 new_updated_at ≥ prev_updated_at | - edit_result = 성공인데 new_updated_at이 갱신되지 않음<br>- new_updated_at < prev_updated_at<br>- new_updated_at NULL/파싱 불가 |  | High | Pass |
| 6.1.4 |  |  | 수정 후에는 수정된 게시글 상세 페이지로 리다이렉트한다. | 수정 결과(edit_result), 리다이렉트 대상(redirect_target), 게시글 ID(post_id) | - edit_result = 성공<br>- redirect_target = 해당 post_id의 게시글 상세 페이지 | - edit_result = 실패인데 상세 페이지로 이동<br>- edit_result = 성공인데 다른 페이지로 이동<br>- redirect_target NULL/알 수 없는 값 | 6.1.3 | Medium | Pass |
| 7 | 게시글 삭제 |  |  | - | - | - |  |  |  |
| 7.1 |  | 작성자가 작성한 게시글을 삭제하거나, 관리자가 특정 게시글을 삭제할 수 있는 기능 |  | - | - | - |  |  |  |
| 7.1.1 |  |  | 삭제 권한은 작성자 본인 또는 관리자에게만 부여한다. | 로그인 사용자 ID(current_user_id), 게시글 작성자 ID(author_id), 사용자 권한(role) | - current_user_id = author_id (일반 사용자) 또는 role = 관리자 | - current_user_id ≠ author_id AND role ≠ 관리자<br>- 비로그인 사용자가 삭제 시도<br>- role 값이 정의되지 않음 |  | High | Pass |
| 7.1.2 |  |  | 삭제 후 게시글 목록 페이지로 리다이렉트한다. | 삭제 결과(delete_result), 리다이렉트 대상(redirect_target) | - delete_result = 성공<br>- redirect_target = 게시글 목록 페이지 | - delete_result = 실패인데 목록 페이지로 이동<br>- delete_result = 성공인데 다른 페이지로 이동<br>- redirect_target NULL/알 수 없는 값 |  | Medium | Pass |
| 8 | 게시글 목록 |  |  | - | - | - |  |  |  |
| 8.1 |  | 저장된 게시글 목록과 상세 내용을 사용자에게 보여주는 기능 |  | - | - | - |  |  |  |
| 8.1.1 |  |  | 게시글 목록은 시간 순으로 정열한다. | 정렬 기준(sort_key), 정렬 방향(sort_order), 게시글 목록 데이터 | - sort_key = 작성일자 또는 조회 시간<br>- sort_order가 정의된 방향(예: 최신순/오래된순)이고 실제 데이터가 해당 순서로 정렬됨 | - sort_key가 다른 값(제목 등)으로 설정되어 시간 순이 아님<br>- sort_order NULL/알 수 없음<br>- 데이터가 정렬되지 않은 상태로 표시 |  | Medium | Pass |
| 8.1.2 |  |  | 목록 페이지에는 게시글 제목, 작성자, 작성일, 좋아요 수 등을 확인한다. | 각 게시글의 제목(title), 작성자(author), 작성일(created_at), 좋아요 수(like_count) | - 목록의 각 행에 제목, 작성자, 작성일, like_count가 모두 표시됨<br>- 값들이 NULL이 아니고 형식이 올바름 | - 일부 항목이 누락(예: like_count 미표시)<br>- 필드가 NULL/파싱 불가 형식<br>- 잘못된 필드가 표시(다른 정보와 혼동) |  | High | Pass |
| 9 | 게시글 조회 |  |  | - | - | - |  |  |  |
| 9.1 |  | 사용자가 게시글 목록에서 게시글을 조회하는 기능 |  | - | - | - |  |  |  |
| 9.1.1 |  |  | 사용자가 게시글 제목을 클릭하면 상세 페이지로 이동하여 게시글 내용을 확인할 수 있다. | 게시글 ID(post_id), 클릭 이벤트(click_event) | - 유효한 post_id가 존재<br>- 제목 클릭 시 해당 post_id의 상세 페이지로 이동 | - 존재하지 않는 post_id로 이동 시도<br>- 제목 클릭 시 다른 페이지로 이동<br>- 상세 페이지 로딩 실패 | 9.1.2 | High | Pass |
| 9.1.2 |  |  | 조회 시 게시글 조회수가 자동으로 증가한다. | 게시글 ID(post_id), 기존 조회수(view_count) | - 유효한 post_id<br>- 상세 페이지 진입 시 view_count가 1 증가 | - post_id가 존재하지 않음<br>- 조회 후 view_count가 증가하지 않음<br>- view_count가 음수/NULL 등 비정상 값 |  | Medium | Pass |
| 10 | 게시글 검색 |  |  | - | - | - |  |  |  |
| 10.1 |  | 사용자가 기존에 작성된 게시글을 검색하는 기능 |  | - | - | - |  |  |  |
| 10.1.1 |  |  | 사용자는 검색창에 검색하고 싶은 텍스트를 입력한다. | 검색어(search_text) | - search_text 1자 이상, 허용 길이/문자 집합 만족 | - search_text 공백/NULL 또는 공백만 존재<br>- search_text 길이 제한 초과 |  | Low | Pass |
| 10.1.2 |  |  | 입력 후 게시글 목록을 화면에 보여준다. | 검색어(search_text), 검색 결과 목록(result_list) | - 유효한 search_text로 검색 수행<br>- 조건에 맞는 게시글 목록(0개 이상)을 화면에 표시 | - 검색 과정에서 오류 발생하여 목록 표시 실패<br>- 조건과 무관한 게시글이 표시<br>- 검색 결과는 있으나 빈 목록으로 표시 | 8.1.1, 8.1.2 | Low | Fail |
| 11 | 게시글 평가 |  |  | - | - | - |  |  |  |
| 11.1 |  | 사용자가 기존에 작성된 게시글을 평가하는 기능 |  | - | - | - |  |  |  |
| 11.1.1 |  |  | 사용자가 조회가 끝난 게시글에 좋아요를 클릭하면 좋아요 수가 오른다. | 게시글 ID(post_id), 로그인 사용자 ID(user_id), 기존 좋아요 수(like_count), 사용자의 좋아요 여부(has_liked) | - 유효한 post_id, user_id<br>- 사용자가 해당 게시글에 아직 좋아요를 누르지 않은 상태(has_liked = false)<br>- 클릭 시 like_count가 1 증가, has_liked = true로 변경 | - post_id 존재하지 않음<br>- 비로그인 사용자가 좋아요 클릭<br>- 이미 has_liked = true 상태에서 다시 좋아요 클릭(중복 반영)<br>- like_count가 증가하지 않거나 비정상 값 | 12.1.3 | High | Pass |
| 11.1.2 |  |  | 사용자가 조회가 끝난 게시글에 싫어요를 클리하면 싫어요 수가 오른다. | 게시글 ID(post_id), 로그인 사용자 ID(user_id), 기존 싫어요 수(dislike_count), 사용자의 싫어요 여부(has_disliked) | - 유효한 post_id, user_id<br>- has_disliked = false 상태에서 클릭 시 dislike_count 1 증가, has_disliked = true로 변경 | - post_id 존재하지 않음<br>- 비로그인 사용자가 싫어요 클릭<br>- 이미 has_disliked = true 상태에서 다시 클릭(중복 반영)<br>- dislike_count가 증가하지 않거나 비정상 값 | 12.1.3 | High | Pass |
| 11.1.3 |  |  | 기존에 작성된 게시글 중 좋아요와 싫어요의 개수가 특정 조건을 만족하는 게시글을 인기게시글로 분류한다. | 좋아요 수(like_count), 싫어요 수(dislike_count), 인기 기준 설정값(thresholds), 인기 여부(popular_flag) | - thresholds가 정의되어 있음<br>- like_count, dislike_count가 thresholds 조건을 만족할 때 popular_flag = true<br>- 만족하지 않으면 popular_flag = false | - thresholds 미설정 또는 비정상 값<br>- 조건을 만족했는데 popular_flag가 true로 설정되지 않음<br>- 조건을 만족하지 않았는데 popular_flag = true로 설정됨 | 12.1.1, 12.1.2 | High | Pass |
| 12 | 댓글 생성 |  |  | - | - | - |  |  |  |
| 12.1 |  | 사용자가 임의의 게시글에 대하여 답하는 짧은 글을 생성하는 기능 |  | - | - | - |  |  |  |
| 12.1.1 |  |  | 사용자는 댓글을 생성할 임의의 게시글 페이지로 이동해야 한다. | 게시글 ID(post_id), 현재 페이지 URL | - 현재 페이지가 해당 post_id의 상세 페이지<br>- post_id가 실제 존재 | - post_id가 존재하지 않음<br>- 다른 게시글 페이지에서 댓글 생성 시도 |  | High | Pass |
| 12.1.2 |  |  | 사용자는 게시글 아래 입력 박스를 통해 적어도 1자 이상의 텍스트를 입력해야 한다. | 댓글 입력 텍스트(comment_input) | - comment_input 길이 ≥ 1, 허용 길이/문자 집합 만족 | - comment_input 공백/NULL 또는 공백만 존재<br>- 최대 길이 초과<br>- 허용되지 않은 문자 포함 | 14.1.5 | High | Pass |
| 12.1.3 |  |  | 사용자는 텍스트 입력 후 댓글을 서버에 전송하기 위해 적절한 버튼을 클릭해야 한다. | 댓글 입력 텍스트(comment_input), 전송 버튼 클릭 이벤트(click_event) | - 유효한 comment_input 입력 후 클릭 이벤트 발생 시 서버로 요청 전송 | - comment_input이 비정상인데 전송 시도<br>- 클릭해도 서버 요청이 발생하지 않음<br>- 전송 버튼 중복 클릭으로 인한 중복 요청 |  | High | Pass |
| 12.1.4 |  |  | 시스템은 사용자가 전송한 정보가 잘전송되었다면, 사용자가 생성한 댓글을 바탕으로 AI가 생성한 텍스트가 사용자의 이름과 함께 표시해야 한다. | 서버 응답 상태(response_status), 사용자 프롬프트(comment_input), AI 생성 텍스트(ai_comment), 사용자 이름(user_name) | - response_status = 성공(예: 200)<br>- ai_comment가 생성되고 화면에 user_name과 함께 표시 | - response_status가 실패 코드<br>- ai_comment가 NULL/공백<br>- user_name 미표시 | 14.1.2, 14.1.3, 14.1.8, 15.1.2 | High | Pass |
| 13 | 댓글 수정 |  |  | - | - | - |  |  |  |
| 13.1 |  | 사용자가 기존에 생성한 댓글을 수정하는 기능 |  | - | - | - |  |  |  |
| 13.1.1 |  |  | 사용자는 수정할 댓글이 존재하는 게시글 페이지로 이동해야 한다. | 댓글 ID(comment_id), 게시글 ID(post_id), 현재 페이지 URL | - 현재 페이지가 해당 post_id의 상세 페이지<br>- comment_id가 해당 게시글에 실제 존재 | - comment_id가 존재하지 않음<br>- 다른 게시글 페이지에서 해당 comment_id 수정 시도 |  | High | Pass |
| 13.1.2 |  |  | 시스템은 로그인 정보를 기반으로 사용자가 입력한 댓글과 그렇지 않은 댓글을 구분하여 수정 가능 여부를 표시해야 한다. | 로그인 사용자 ID(current_user_id), 각 댓글의 작성자 ID(comment_author_id) | - current_user_id = comment_author_id인 댓글에만 수정 가능 표시 | - 모든 댓글에 수정 가능 표시<br>- 본인 댓글에도 수정 가능 표시가 보이지 않음<br>- 로그인하지 않았는데 수정 가능 표시 | 13.1.4, 14.1.3, 15.1.2 | Medium | Pass |
| 13.1.3 |  |  | 사용자는 자신이 생성한 임의의 댓글 박스에 표시된 수정용 버튼을 클릭하여 기존에 입력한 댓글을 수정할 수 있다. | 댓글 ID(comment_id), 로그인 사용자 ID(current_user_id), 수정 버튼 클릭 이벤트 | - current_user_id = 해당 comment_id의 작성자<br>- 수정 버튼 클릭 시 수정 모드로 진입 | - 작성자가 아닌 사용자가 수정 버튼 클릭<br>- 클릭해도 수정 모드로 진입하지 않음 | 14.1.2, 15.1.3 | High | Pass |
| 13.1.4 |  |  | 사용자가 수정 가능한 댓글은 실제 화면에 표시된 댓글이 아닌 댓글을 생성하기 위한 프롬프트로 한정된다. | 기존 프롬프트(original_prompt), 기존 AI 댓글 텍스트(ai_comment) | - 수정 UI에서 original_prompt만 편집 가능<br>- ai_comment는 직접 편집 불가 | - ai_comment를 직접 수정할 수 있음<br>- original_prompt를 수정할 수 없음 |  | High | Pass |
| 13.1.5 |  |  | 사용자가 수정하고자 입력한 댓글은 기존 댓글을 포함해 적어도 1자 이상이어야 한다. | 수정 프롬프트(edit_prompt) | - edit_prompt 길이 ≥ 1, 허용 길이/문자 집합 만족 | - edit_prompt 공백/NULL 또는 공백만 존재<br>- 허용 길이 초과<br>- 허용되지 않은 문자 포함 | 13.1.2 | High | Pass |
| 13.1.6 |  |  | 시스템은 댓글 수정 요청이 들어오면 로그인 정보를 기반으로 작성자가 맞는 경우에만 그 요청을 수락해야 한다. | 댓글 작성자 ID(comment_author_id), 로그인 사용자 ID(current_user_id) | - current_user_id = comment_author_id일 때만 수정 요청 수락 | - current_user_id ≠ comment_author_id인데 수정 요청 수락<br>- 비로그인 사용자의 수정 요청 수락 | 15.1.4 | High | Pass |
| 13.1.7 |  |  | 시스템은 댓글 수정이 요청이 잘 전송되었다면, 사용자가 수정한 댓글을 바탕으로 AI가 생성한 텍스트를 사용자의 이름과 함께 표시해야 한다. | 서버 응답 상태(response_status), 수정 프롬프트(edit_prompt), AI 생성 텍스트(ai_comment), 사용자 이름(user_name) | - response_status = 성공<br>- ai_comment가 생성되고 user_name과 함께 화면에 표시 | - response_status가 실패 코드<br>- ai_comment NULL/공백<br>- user_name 미표시 | 13.1.4 | High | Pass |
| 13.1.8 |  |  | 시스템은 댓글 수정 요청이 들어오면, 수정된 프롬프트와 기존 댓글을 합쳐서 새로운 프롬프트로 입력하여 AI가 댓글을 생성하도록 하여야 한다. | 기존 프롬프트(original_prompt), 수정 프롬프트(edit_prompt), AI 입력 프롬프트(combined_prompt) | - combined_prompt가 original_prompt와 edit_prompt를 모두 포함하는 문자열 | - combined_prompt가 original 또는 edit 중 하나만 포함<br>- combined_prompt가 NULL/공백 |  | High | Pass |
| 14 | 댓글 삭제 |  |  | - | - | - |  |  |  |
| 14.1 |  | 사용자가 기존에 생성한 댓글을 삭제하는 기능 |  | - | - | - |  |  |  |
| 14.1.1 |  |  | 사용자는 삭제할 댓글이 존재하는 게시글 페이지로 이동해야 한다. | 댓글 ID(comment_id), 게시글 ID(post_id), 현재 페이지 URL | - 현재 페이지가 해당 post_id의 상세 페이지<br>- comment_id가 해당 게시글에 실제 존재 | - comment_id가 존재하지 않음<br>- 다른 게시글 페이지에서 삭제 시도 |  | High | Pass |
| 14.1.2 |  |  | 시스템은 로그인 정보를 기반으로 사용자가 입력한 댓글과 그렇지 않은 댓글을 구분하여 삭제 가능 여부를 표시해야 한다. | 로그인 사용자 ID(current_user_id), 각 댓글의 작성자 ID(comment_author_id) | - current_user_id = comment_author_id인 댓글만 삭제 가능 표시 | - 모든 댓글에 삭제 가능 표시<br>- 본인 댓글에 삭제 가능 표시가 보이지 않음<br>- 비로그인 사용자가 삭제 가능으로 보임 | 13.1.4, 14.1.2 | Medium | Pass |
| 14.1.3 |  |  | 사용자는 자신이 생성한 임의의 댓글 박스에 표시된 삭제용 버튼을 클릭하여 기존에 입력한 댓글을 삭제할 수 있다. | 댓글 ID(comment_id), 로그인 사용자 ID(current_user_id), 삭제 버튼 클릭 이벤트 | - current_user_id = 해당 comment_id 작성자<br>- 삭제 버튼 클릭 시 삭제 요청 전송 | - 작성자가 아닌 사용자가 삭제 버튼 클릭<br>- 클릭해도 삭제 요청이 전송되지 않음 | 14.1.3 | High | Pass |
| 14.1.4 |  |  | 시스템은 댓글 삭제 요청이 들어오면 로그인 정보를 기반으로 작성자가 맞는 경우에만 그 요청을 수락해야 한다. | 댓글 작성자 ID(comment_author_id), 로그인 사용자 ID(current_user_id) | - current_user_id = comment_author_id인 경우에만 삭제 요청 수락 | - current_user_id ≠ comment_author_id인데 삭제 요청 수락<br>- 비로그인 사용자의 삭제 요청 수락 | 14.1.6 | High | Pass |
| 14.1.5 |  |  | 시스템은 댓글 삭제 요청이 잘 전송되었다면, 해당 댓글을 즉시로 삭제 후 표시해야 한다. | 삭제 요청 결과(delete_result), 댓글 ID(comment_id) | - delete_result = 성공<br>- 해당 comment_id에 대한 댓글이 화면과 저장소에서 제거 | - delete_result = 성공인데 화면 또는 저장소에 댓글이 남아 있음<br>- 다른 댓글이 잘못 삭제됨 |  | High | Pass |
| 14.1.6 |  |  | 시스템은 댓글 삭제 요청이 잘전송되지 않았다면, 시스템은 댓글의 상태를 변경해서는 안된다. | 삭제 요청 결과(delete_result), 기존 댓글 상태(old_comment_state) | - delete_result = 실패일 때 old_comment_state가 그대로 유지 | - 실패했는데 댓글이 사라지거나 상태가 변경됨 |  | High | Pass |
| 15 | 관리자 도구(다른 사용자 정보 관리) |  |  | - | - | - |  |  |  |
| 15.1 |  | 다른 사용자의 정보를 관리하는 기능 |  | - | - | - |  |  |  |
| 15.1.1 |  |  | 개발자가 관리자 계정을 임의로 생성한다. | 관리자 계정 ID(admin_id), 권한 레벨(role) | - admin_id가 유일한 값<br>- role = 관리자 | - 중복된 admin_id 생성<br>- role이 관리자 이외의 값으로 설정 |  | High | Pass |
| 15.1.2 |  |  | 관리자 계정으로 로그인을 한다. | 관리자 계정 ID/이메일, 비밀번호, 계정 권한(role) | - 관리자 계정의 ID/비밀번호가 일치<br>- role = 관리자 | - 비밀번호 불일치<br>- role이 관리자 아닌 계정으로 로그인 시도<br>- 계정이 잠김/비활성 상태 |  | High | Pass |
| 15.1.3 |  |  | 관리자는 다른 사용자가 쓴 글를 삭제할 수 있다. | 관리자 ID(admin_id) | - admin_id가 관리자 권한 보유 | - 관리자 권한이 아닌 계정으로 삭제 시도 | 16.1.7 | High | Pass |
| 16 | 알림 |  |  | - | - | - |  |  |  |
| 16.1 |  | 사용자가 알아야 하는 정보를 전달하는 기능 |  | - | - | - |  |  |  |
| 16.1.1 |  |  | 시스템은 사용자의 게시글 평가 기능이 발생하면 감지하고 알림을 전송해야 한다. | 평가 이벤트(post_id, 평가 타입, 대상 사용자 ID), 대상 사용자의 알림 설정(notification_opt_in) | - 게시글 평가 이벤트 발생<br>- 대상 사용자의 notification_opt_in = 수신<br>- 해당 사용자에게 알림 생성 및 전송 | - notification_opt_in = 미수신인데 알림 전송<br>- 수신 설정이 수신인데 알림이 전송되지 않음<br>- 이벤트 감지 실패 | 17.1.6 | High | Pass |
| 16.1.2 |  |  | 시스템은 사용자의 댓글에 답글이 달리면 감지하고 알림을 전송해야 한다. | 답글 이벤트(comment_id, reply_id, 대상 사용자 ID), 대상 사용자의 알림 설정(notification_opt_in) | - 댓글에 새로운 답글이 달림<br>- 대상 사용자의 notification_opt_in = 수신<br>- 해당 사용자에게 알림 생성 및 전송 | - notification_opt_in = 미수신인데 알림 전송<br>- 수신 설정이 수신인데 알림이 전송되지 않음<br>- 이벤트 감지 실패 | 17.1.6 | High | Pass |
| 16.1.3 |  |  | 알림 내용은 명확하게 표시되어야 하고, 사용자가 바로 이해할 수 있어야 한다. | 알림 메시지 내용(message_text) | - message_text가 공백이 아니며, 관련 게시글/댓글/행위자 등 필수 정보를 포함 | - message_text 공백/NULL<br>- 어떤 사건에 대한 알림인지 이해하기 어려운 내용 |  | Low | Pass |
| 16.1.4 |  |  | 알림 수신 기록을 저장하여 확인할 수 있어야 한다. | 알림 ID(notification_id), 수신 시간(received_at), 읽음 여부(read_flag), 사용자 ID(user_id) | - 각 발송된 알림이 notification_id, received_at, read_flag, user_id와 함께 저장<br>- 사용자가 알림 목록에서 과거 수신 기록을 조회 가능 | - 일부 알림이 기록되지 않음<br>- received_at 또는 read_flag가 NULL/비정상 값 |  | High | Pass |
| 17 | UI/UX |  |  | - | - | - |  |  |  |
| 17.1 |  | 사용자 경험과 인터페이스 개선 기능 |  | - | - | - |  |  |  |
| 17.1.1 |  |  | 화면 레이아웃, 버튼, 메뉴, 폰트, 색상, 아이콘 등의 디자인 일관성을 유지한다. | 화면별 UI 요소 정의(레이아웃, 버튼 스타일, 폰트, 색상, 아이콘 등) | - 동일한 유형의 화면/컴포넌트에 동일한 스타일 가이드 적용<br>- 페이지 간 레이아웃/폰트/색상 체계가 일관됨 | - 일부 페이지에서만 다른 폰트/색상/레이아웃 사용<br>- 동일 기능 버튼의 스타일이 페이지마다 다름 |  | High | Pass |
| 17.1.2 |  |  | 주요 기능(관리자 도구, 알림 등)에 접근하기 쉬워야 한다. | 네비게이션 구조(nav_structure), 메뉴 위치(menu_position), 접근 단계 수(click_depth) | - 관리자 도구, 알림 등 주요 기능이 눈에 띄는 위치에 배치<br>- click_depth가 과도하지 않고 1~2단계 이내 접근 가능 | - 메뉴가 숨겨져 있거나 찾기 어려운 위치에 있음<br>- 기능 접근을 위해 너무 많은 단계(클릭)가 필요 | 18.1.1 | High | Pass |
| 17.1.3 |  |  | 버튼, 입력 필드, 메뉴 등은 직관적이어야 하고, 터치 영역이 충분해야 한다. | 버튼/입력 필드 라벨(label_text), 컴포넌트 크기(size), 간격(spacing) | - label_text가 기능을 명확히 설명<br>- 버튼/입력 필드가 최소 크기 기준 이상<br>- 모바일 환경에서 터치하기 충분한 영역 확보 | - 라벨이 모호하거나 의미가 불명확<br>- 버튼/입력 필드가 너무 작음<br>- 요소 간 간격이 좁아 오동작 발생 | 18.1.1 | High | Pass |
| 17.1.4 |  |  | 로그인시 사이트의 UI가 흑백에서 컬러로 전환되어야 한다. | 로그인 상태(is_logged_in), 현재 테마 상태(theme_mode) | - is_logged_in = false일 때 theme_mode = 흑백<br>- is_logged_in = true일 때 theme_mode = 컬러로 전환 | - 로그인했는데도 theme_mode가 흑백 유지<br>- 로그아웃 후에도 theme_mode가 컬러로 남아 있음<br>- 전환 애니메이션/상태가 비정상 | 2.1.6, 3.1.1 | Low | Pass |

