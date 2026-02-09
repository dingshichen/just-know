# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Spring Boot 3 + React 19 的企业级管理系统，采用前后端分离架构。后端使用 MyBatis-Plus 进行数据持久化，前端基于 Ant Design Pro + Umi 4 框架。

- **后端路径**: `server/` - Spring Boot 3.5.6 + Java 25
- **前端路径**: `web/` - React 19 + Umi 4 + Ant Design Pro

## 开发命令

### 后端 (server/)
```bash
# 进入后端目录
cd server

# 使用 Maven 编译项目
mvn clean compile

# 运行测试
mvn test

# 打包项目
mvn clean package

# 运行应用 (Spring Boot)
mvn spring-boot:run
```

### 前端 (web/)
```bash
# 进入前端目录
cd web

# 安装依赖 (需要 pnpm)
pnpm install

# 开发模式启动 (连接后端 http://localhost:8080)
pnpm run dev

# 演示模式启动 (使用 mock 数据)
pnpm run start

# 构建生产版本
pnpm run build

# 代码检查
pnpm run lint

# 类型检查
pnpm run tsc
```

**注意**: 前端需要 Node.js >= 20.0.0 和 pnpm 包管理器。

## 项目架构

### 后端架构

后端采用标准的三层架构模式，所有包位于 `cn.dsc.jk` 命名空间下：

- **controller**: REST API 控制器层 (`cn.dsc.jk.control`)
- **service**: 业务逻辑层 (`cn.dsc.jk.service` + `cn.dsc.jk.service.impl`)
- **mapper**: MyBatis 数据访问层 (`cn.dsc.jk.mapper`)
- **entity**: 数据库实体类 (`cn.dsc.jk.entity`) - 所有实体类以 `Entity` 后缀命名
- **dto**: 数据传输对象 (`cn.dsc.jk.dto`) - 按业务模块分包，如 `dto.user`, `dto.role`
- **config**: Spring 配置类 (`cn.dsc.jk.config`)
- **common**: 通用类，如 `Result` 统一响应封装、`PageQuery` 分页查询基类

**关键配置**:
- 数据库连接配置: `server/src/main/resources/application.yaml` 和 `application-dev.yaml`
- MyBatis Mapper XML: `server/src/main/resources/mybatis/`

### 前端架构

前端基于 Umi 4 约定式路由，主要目录结构：

- **config/**: Umi 配置文件
  - `routes.ts`: 路由配置
  - `proxy.ts`: 开发时代理配置 (前端 `localhost:8000` -> 后端 `localhost:8080`)
  - `config.ts`: Umi 框架配置
- **src/pages/**: 页面组件，按功能模块组织
- **src/services/ant-design-pro/**: API 服务层，每个模块对应一个服务文件 (如 `user.ts`, `role.ts`)
- **src/components/**: 可复用组件
- **mock/**: Mock 数据文件，开发时与 API 同步更新

**开发环境代理**: 前端通过 `/api/` 路径代理到 `http://localhost:8080`，详见 `web/config/proxy.ts`

## 数据传输对象 (DTO) 规范

后端与前端的数据交互通过统一命名的 DTO 类完成：

### 后端 DTO 命名规范
- **Option**: 用于下拉选项、标签展示，仅包含 ID 和名称字段
  - 例如: `UserOption { userId, userName }`
  - 不包含其他自定义类型对象
- **Item**: 用于表格、列表展示，继承 Option 类
  - 例如: `UserItem extends UserOption`
  - 可包含其他 Option 对象作为属性
- **Detail**: 用于详情页展示，继承 Item 类
  - 例如: `UserDetail extends UserItem`
  - 可包含大文本字段和其他关联对象 (Option/Item/Detail)
- **Create**: 新增操作的请求参数
- **Update**: 修改操作的请求参数
- **PageQuery**: 分页查询条件，继承 `PageQuery` 基类

### 前端 TypeScript 类型
前端服务文件中应定义对应的 TypeScript 类型，与后端 DTO 保持一致：
```typescript
// 对应后端的 Option/Item/Detail
export class RoleOption {
  roleId: string;
  roleName: string;
}

export class RoleItem extends RoleOption {
  roleCode?: string;
  // ...
}

// 对应后端的 Create/Update
export type RoleForm = {
  roleName: string;
  roleCode: string;
};
```

## API 命名规范

后端 Controller 采用 RESTful 风格，方法命名约定：

| 操作 | HTTP 方法 | 路径 | 方法名 | 返回值 |
|------|-----------|------|--------|--------|
| 新增 | POST | `/api/{resource}` | `create` | `Result<Long>` (主键ID) |
| 修改 | PUT | `/api/{resource}/{id}` | `update` | `Result<?>` |
| 删除 | DELETE | `/api/{resource}/{id}` | `delete` | `Result<?>` |
| 分页查询 | GET | `/api/{resource}/page` | `page` | `Result<PageInfo<Item>>` |
| 查询全部 | GET | `/api/{resource}/list` | `listAll` | `Result<List<Item>>` |
| 查询详情 | GET | `/api/{resource}/{id}` | `load` | `Result<Detail>` |
| 查询选项 | GET | `/api/{resource}/select` | `select` | `Result<List<Option>>` |

Controller 方法按顺序排列：查询 -> 新增 -> 修改 -> 删除

Service 层方法命名与 Controller 对应，分页查询使用 `PageHelper` 实现，默认按主键降序排序。

## 数据库字段映射规范

- Entity 类添加 `Entity` 后缀 (如 `UserEntity`)
- 日期时间使用 `LocalDate` 或 `LocalDateTime`，禁止使用 `Date`
- `tinyint(1)` 映射为 `Boolean` 类型
- 主键 ID 在前端统一使用 `string` 类型，避免 JavaScript 精度丢失

## 代码规范要点

### 后端代码规范
- **@author 注解**: 统一设置为 `ding.shichen`
- **禁止使用**: MyBatis-Plus 的 QueryWrapper、UpdateWrapper、LambdaQueryWrapper、LambdaUpdateWrapper、lambdaQuery
- **集合判空**: 使用 Hutool 工具类方法 (如 `CollUtil.isEmpty()`)
- **依赖注入**: Service 层使用 `@Autowired` 字段注入，不使用 `@RequiredArgsConstructor`
- **Mapper**: 继承 `com.baomidou.mybatisplus.core.mapper.BaseMapper`
- **Service**: 接口继承 `com.baomidou.mybatisplus.extension.service.IService`，实现类继承 `com.baomidou.mybatisplus.extension.service.impl.ServiceImpl`

### 前端代码规范
- **API 变更同步**: 修改 API 调用代码时，必须同步更新 `mock/` 目录下的 Mock 数据
- **ID 类型**: 主键 ID 强制使用 `string` 类型
- **不展示 ID**: UI 层不直接展示数据库 ID (如 userId、roleId)
- **useRef**: 使用 `useRef` 时显式设置 `initialValue` 为 `null`

## 技术栈

### 后端主要依赖
- Spring Boot 3.5.6 (Undertow 容器)
- Spring Security (认证授权)
- MyBatis-Plus 3.5.7 (持久层)
- PageHelper (分页)
- Redisson 3.52.0 (Redis 客户端)
- Hutool 5.8.41 (工具库)
- jjwt 0.12.5 (JWT)
- Log4j2 (日志)

### 前端主要依赖
- React 19.1.0
- Ant Design 5.25.4
- Ant Design Pro Components 2.7.19
- Umi 4 (Max)
- dayjs (日期处理)
- TypeScript 5.6.3

## 全局响应结构

后端统一使用 `cn.dsc.jk.common.Result<T>` 封装响应：
```java
public class Result<T> {
    private Integer code;
    private String msg;
    private T data;
}
```

前端对应的 TypeScript 类型：
```typescript
type Result<T> = {
  code: number;
  msg: string;
  data: T;
};
```

分页响应使用 `PageInfo<T>`：
```typescript
type PageInfo<T> = {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
};
```
