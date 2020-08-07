"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const auth_service_1 = require("./auth.service");
const login_user_dto_1 = require("./login-user.dto");
let AuthController = class AuthController {
    constructor(authService, userService, jwtService) {
        this.authService = authService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    loginUser(res, loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("88888888888888", loginDto);
            if (!(loginDto && loginDto.username && loginDto.password)) {
                return res
                    .status(common_1.HttpStatus.FORBIDDEN)
                    .json({ message: 'Username and password are required!' });
            }
            const user = yield this.userService.getUserByUsername(loginDto.username.trim());
            let result = yield this.userService.getUsers();
            console.log(user, "---", result);
            if (user.username) {
                console.log("-------", loginDto.password, user.password);
                let result = (loginDto.password.trim() === user.password.trim());
                console.log("result---", result);
                if (loginDto.password.trim() === user.password.trim()) {
                    let airports = "";
                    let airlines = "";
                    if (user.type.toLowerCase() === 'airline') {
                        airlines = user.iATACode;
                    }
                    else if (user.type.toLowerCase() === 'airport') {
                        airports = user.iATACode;
                    }
                    return res
                        .status(common_1.HttpStatus.OK)
                        .json({ jwt: this.jwtService.sign({
                            id: user.id,
                            userAirlines: airlines,
                            userAirports: airports,
                        }),
                        status: 200,
                        username: loginDto.username,
                    });
                }
            }
            return res
                .status(common_1.HttpStatus.FORBIDDEN)
                .json({ status: 403, message: 'Username or password wrong!' });
        });
    }
};
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Response()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        jwt_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map